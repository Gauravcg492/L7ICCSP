import { AccessCloud } from "./access_cloud";
import fs from 'fs';
import { constants } from '../utils/constants';


export class GoogleAccessCloud implements AccessCloud {
    private drive: any;
    private fileNameToId: { [key: string]: string };

    private ROOTDIR = constants.ROOTDIR;
    private TREEDIR = constants.TREEDIR;

    constructor(drive: any) {
        // Load client secrets from a local file.
        this.drive = drive;
        this.fileNameToId = {};
    }

    private getFolderId(foldername: string): string {
        return this.fileNameToId[foldername] ?? "";
    }

    async getDirList(this: GoogleAccessCloud, dir = this.ROOTDIR): Promise<string[]> {
        const fileNames: string[] = [];
        try {
            let queryString = "";
            if (dir !== "") {
                queryString = `'${this.getFolderId(dir)}' in parents`;
            }
            const res = await this.drive.files.list({
                q: queryString,
                fields: 'nextPageToken, files(id, name)',
            });
            if (res) {
                const files = res.data.files;
                console.log('Files:');
                if (files.length) {
                    files.map((file: any) => {
                        console.log(`${file.name} (${file.id})`);
                        this.fileNameToId[file.name] = file.id;
                        fileNames.push(file.name);
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
        return fileNames;
    }

    async getFile(this: GoogleAccessCloud, dir: string, filename: string, callback: Function): Promise<void> {
        const fileId = this.fileNameToId[filename];
        let dest = fs.createWriteStream(dir + '/' + filename); // file path where google drive function will save the file

        let progress = 0; // This will contain the download progress amount

        // Uploading Single image to drive
        this.drive.files
            .get({ fileId, alt: 'media' }, { responseType: 'stream' })
            .then((driveResponse: any) => {
                driveResponse.data
                    .on('end', () => {
                        console.log("Download Complete");
                        callback(dir + '/' + filename);
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

    async putFile(this: GoogleAccessCloud, filePath: string, dir: string): Promise<void> {
        console.log("Upload called")
        const folderIds = [];
        const folderId = this.getFolderId(dir);
        if (folderId.length > 0) {
            folderIds.push(folderId);
        }
        const fileArray = filePath.split('/');
        const filename = fileArray[fileArray.length - 1];
        var fileMetadata = {
            'name': filename,
            parents: folderIds
        };
        var media = {
            // mimeType: 'image/jpeg',
            body: fs.createReadStream(filePath)
        };
        try {
            const res = await this.drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id'
            });
            if(res) {
                console.log('File Id: ', res.data.id);
                this.fileNameToId[filename] = res.data.id;
                console.log("ID", this.fileNameToId[filename]);
            } else{
                console.log("Upload failed");
            }
        } catch (error) {
            console.log(error);
        }

    }

    renameFile(this: GoogleAccessCloud, oldFileName: string, newFileName: string): void {
        console.log("Rename Called")
        const fileId = this.fileNameToId[oldFileName];
        console.log("Inside rename fileid: ", fileId);
        const body = { 'name': newFileName };
        this.drive.files.update({
            fileId: fileId,
            resource: body,
        }, (err: any, res: any) => {
            if (err) console.log('The API returned an error: ' + err);
            else {
                console.log('The name of the file has been updated!');
            }
        });
    }

    async searchFile(this: GoogleAccessCloud, filePrefix: string, dir = this.TREEDIR): Promise<string[]> {
        const queryString1 = `name contains '${filePrefix}' `
        let queryString2 = "";
        if (dir !== "" && this.getFolderId(dir) !== "") {
            queryString2 = `and '${this.getFolderId(dir)}' in parents`;
        }
        const queryString = queryString1 + queryString2;
        console.log("query string: ", queryString);
        var pageToken = null;
        const filenames: string[] = [];
        try {
            const res = await this.drive.files.list({
                q: queryString,
                fields: 'nextPageToken, files(id,name)',
                spaces: 'drive',
                pageToken: pageToken,
            });
            const files = res.data.files;
            if (files.length) {
                console.log('Files:', files, '\n');
                files.map((file: any) => {
                    this.fileNameToId[file.name] = file.id;
                    filenames.push(file.name);
                });
            } else {
                console.log('No files found.');
            }
        } catch (err) {
            console.log(err.response.status);
        }
        return filenames;
    }

    async putFolder(this: GoogleAccessCloud, folderName: string, dir: string): Promise<void> {
        const folderIds = [];
        const folderId = this.getFolderId(dir);
        if (folderId.length > 0) {
            folderIds.push(folderId);
        }
        var fileMetadata = {
            'name': folderName,
            'mimeType': 'application/vnd.google-apps.folder',
            parents: folderIds
        };
        try {
            const file = await this.drive.files.create({
                resource: fileMetadata,
                fields: 'id'
            });
            if (file) {
                this.fileNameToId[folderName] = file.data.id;
            }
        } catch (err) {
            console.log(err);
        }
    }

}

// const accessCloud = new GoogleAccessCloud();
