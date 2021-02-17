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
    private drive : any;
    constructor(drive:any) {
        // Load client secrets from a local file.
        this.drive = drive;
    }
    
    getDirList(): string[] {
        throw new Error("Method not implemented.");
    }

    getFile(downLoc: string) : void {
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
        throw new Error("Method not implemented.");
    }

}

// const accessCloud = new GoogleAccessCloud();
