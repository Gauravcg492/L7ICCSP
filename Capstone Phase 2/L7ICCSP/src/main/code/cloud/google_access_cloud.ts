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
                        fileNames.push(file.name + ',' + file.id);
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

    async getFile(this: GoogleAccessCloud, dir: string, filename: string): Promise<string> {
        const fileId = this.fileNameToId[filename];
        let dest = fs.createWriteStream(dir + '/' + filename); // file path where google drive function will save the file

        let progress = 0; // This will contain the download progress amount
        const promises = [];
        // Uploading Single image to drive
        const download = new Promise((resolve: (value: string) => void, reject) => {
            this.drive.files
            .get({ fileId, alt: 'media' }, { responseType: 'stream' })
            .then((driveResponse: any) => {
                driveResponse.data
                    .on('end', () => {
                        console.log("Download Complete");
                        resolve(dir + '/' + filename);
                    })
                    .on('error', (err: any) => {
                        throw new Error('Error downloading file.');
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
            .catch((err: any) => {
                console.log(err);
                reject(err)
            });
        });
        promises.push(download);
        try {
            const results = await Promise.all(promises);
            return results[0];
        } catch (err) {
            console.log("getFile() error");
            console.log(err);
        }
        return "";
    }

    async putFile(this: GoogleAccessCloud, filePath: string, dir: string): Promise<boolean> {
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
            if (res) {
                console.log('File Id: ', res.data.id);
                this.fileNameToId[filename] = res.data.id;
                console.log("ID", this.fileNameToId[filename]);
            } else {
                console.log("Upload failed");
            }
            return true;
        } catch (error) {
            console.log("putFile() error");
            console.log(error);
        }
        return false;
    }

    async renameFile(this: GoogleAccessCloud, oldFileName: string, newFileName: string): Promise<boolean> {
        console.log(`Rename Called for file: ${oldFileName} to change to ${newFileName}`);
        const fileId = this.fileNameToId[oldFileName];
        console.log("Inside rename fileid: ", fileId);
        const body = { 'name': newFileName };
        const promises = [];
        promises.push(new Promise((resolve, reject) => {
            this.drive.files.update({
                fileId: fileId,
                resource: body,
            }, (err: any, res: any) => {
                if (err) reject(err);
                else {
                    console.log('The name of the file has been updated!');
                    resolve(res);
                }
            })
        }));
        try {
            await Promise.all(promises);
            return true;
        } catch (err) {
            console.log("renameFile() error");
            console.log(err);
        }
        return false;
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

    async putFolder(this: GoogleAccessCloud, folderName: string, dir: string): Promise<boolean> {
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
            return true;
        } catch (err) {
            console.log(err);
        }
        return false;
    }

}

// const accessCloud = new GoogleAccessCloud();
