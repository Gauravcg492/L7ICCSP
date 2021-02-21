import { AccessCloud } from "./access_cloud";
import fs, { promises } from 'fs';


export class GoogleAccessCloud implements AccessCloud {
    private drive: any;
    private fileNameToId: { [key: string]: string };
    constructor(drive: any) {
        // Load client secrets from a local file.
        this.drive = drive;
        this.fileNameToId = {};
    }

    async getDirList(): Promise<string[]> {
        try {
            const res = await this.drive.files.list({
                pageSize: 10,
                fields: 'nextPageToken, files(id, name)',
            });
            if (res) {
                const files = res.data.files;
                console.log('Files:');
                if (files.length) {
                    files.map((file: any) => {
                        console.log(`${file.name} (${file.id})`);
                        this.fileNameToId[file.name] = file.id;
                    });
                } else {
                    console.log("No files found");
                }
            }
            else {
                console.log("no response");
            }
        } catch (err) {
            console.log(err);
        }
        return Object.keys(this.fileNameToId);
    }

    async getFile(dir: string, filename: string, callback: Function): Promise<void> {
        const fileId = this.fileNameToId[filename];
        let dest = fs.createWriteStream(dir + filename); // file path where google drive function will save the file

        let progress = 0; // This will contain the download progress amount

        // Uploading Single image to drive
        this.drive.files
            .get({ fileId, alt: 'media' }, { responseType: 'stream' })
            .then((driveResponse: any) => {
                driveResponse.data
                    .on('end', () => {
                        console.log("Download Complete");
                        callback(dir + filename);
                    })
                    .on('error', (err: any) => {
                        console.error('Error downloading file.');
                    })
                    .on('data', (d: any) => {
                        progress += d.length;
                        if (process.stdout.isTTY) {
                            process.stdout.clearLine(0);
                            process.stdout.cursorTo(0);
                            process.stdout.write(`Downloaded ${progress} bytes`);
                        }

                    })
                    .pipe(dest);
            })
            .catch((err: any) => console.log(err));
    }

    putFile(filePath: string): void {
        const fileArray = filePath.split('/');
        const filename = fileArray[fileArray.length - 1];
        var fileMetadata = {
            'name': filename
        };
        var media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(filePath)
        };
        this.drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        }, function (err: any, res: any) {
            if (err) {
                // Handle error
                console.log(err);
            } else {
                console.log("--- Upload successful ---");
                console.log('File Id: ', res.data.id);
            }
        });

    }

    renameFile(oldFileName: string, newFileName: string): void {
        const fileId = this.fileNameToId[oldFileName];
        var body = { 'name': newFileName };
        this.drive.files.update({
            fileId: fileId,
            resource: body,
        }, (err: any, res: any) => {
            if (err) return console.log('The API returned an error: ' + err);
            else {
                console.log('The name of the file has been updated!');
            }
        });
    }

    async searchFile(filePrefix: string): Promise<string[]> {
        const queryString = "name contains '"+ filePrefix +"'";
        console.log("query string: ", queryString);
        var pageToken = null;
        const filenames:string[] = [];
        try{
            const res = await this.drive.files.list({
                q: queryString,
                fields: 'nextPageToken, files(name)',
                spaces: 'drive',
                pageToken: pageToken,
            });
            const files = res.data.files;
            if (files.length) {
                console.log('Files:', files, '\n');
                files.map((file: any) => {
                    filenames.push(file['name']);
                });
            } else {
                console.log('No files found.');
            }
        } catch(err) {
            console.log(err);
        }
        return filenames;
    }
}

// const accessCloud = new GoogleAccessCloud();
