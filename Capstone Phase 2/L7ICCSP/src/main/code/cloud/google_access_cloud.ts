import { AccessCloud } from "./access_cloud";
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

export class GoogleAccessCloud implements AccessCloud {
    private drive: any;
    constructor(drive: any) {
        // Load client secrets from a local file.
        this.drive = drive;
    }

    getDirList(): string[] {
        //const drive = google.drive({ version: 'v3', auth });
        this.drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        }, (err: any, res: any) => {
            if (err) return console.log('The API returned an error: ' + err);
            const files = res.data.files;
            if (files.length) {
                console.log('Files:');
                files.map((file: any) => {
                    console.log(`${file.name} (${file.id})`);
                });
            } else {
                console.log('No files found.');
            }
        });
        throw new Error("Method not implemented.");
    }

    getFile(downLoc: string): void {
        let dir = `./downloads`; // directory from where node.js will look for downloaded file from google drive

        let fileId = process.argv[2]; // Desired file id to download from  google drive

        let dest = fs.createWriteStream('./downloads/' + process.argv[3]); // file path where google drive function will save the file

        // const drive = google.drive({ version: 'v3', auth }); // Authenticating drive API

        let progress = 0; // This will contain the download progress amount

        // Uploading Single image to drive
        this.drive.files
            .get({ fileId, alt: 'media' }, { responseType: 'stream' })
            .then((driveResponse: any) => {
                driveResponse.data
                    .on('end', () => {

                    })
                    .on('error', (err: any) => {
                        console.error('Error downloading file.');
                    })
                    .on('data', (d: any) => {
                        progress += d.length;
                        /*
                        if (process.stdout.isTTY) {
                            process.stdout.clearLine();
                            process.stdout.cursorTo(0);
                            process.stdout.write(`Downloaded ${progress} bytes`);
                        }
                        */
                    })
                    .pipe(dest);
            })
            .catch((err: any) => console.log(err));
    }

    putFile(): void {
        // const drive = google.drive({ version: 'v3', auth });
        var fileMetadata = {
            'name': process.argv[2]
        };
        var media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(process.argv[2])
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

    rnFile(): void {
        //const drive = google.drive({ version: 'v3', auth });
        var body = { 'name': process.argv[3] };
        this.drive.files.update({
            fileId: process.argv[2],
            resource: body,
        }, (err: any, res: any) => {
            if (err) return console.log('The API returned an error: ' + err);
            else {
                console.log('The name of the file has been updated!');
            }
        });
    }

    searchFile(): any {
        //const drive = google.drive({ version: 'v3', auth });
        this.drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        }, (err:any, res:any) => {
            if (err) return console.log('The API returned an error: ' + err);
            const files = res.data.files;
            if (files.length) {
                console.log('Files:');
                files.map((file:any) => {
                    if ((file.name).includes(process.argv[2])) {
                        console.log(`${file.name} (${file.id})`);
                    }
                });
            } else {
                console.log('No files found.');
            }
        });
        return "String not found";
    }
}

// const accessCloud = new GoogleAccessCloud();
