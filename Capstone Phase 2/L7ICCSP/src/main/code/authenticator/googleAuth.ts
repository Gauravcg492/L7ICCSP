import { Authentication } from "./authentication"
import fs from 'fs';
import { google } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/userinfo.profile'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

export class GoogleAuth implements Authentication {
    private drive: any;
    private oAuth2Client: any;
    private token: any;
    private authUrl: any;

    constructor() {
        this.token = "";
        this.authUrl = "";
    }

    private setDrive(auth: any) {
        this.drive = google.drive({ version: 'v3', auth }); // Authenticating drive API
    }

    public getDrive() {
        return this.drive;
    }

    public isToken(): boolean {
        return this.token !== "";
    }

    public getAuthUrl() {
        return this.authUrl;
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    public async authorize(this: GoogleAuth): Promise<void> {
        // Load client secrets from a local file.
        try {
            const credentials = JSON.parse(fs.readFileSync('credentials.json') as unknown as string);
            // console.log("credentials");
            // Authorize a client with credentials, then call the Google Drive API.
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            // console.log("cred");
            this.oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);

            this.authUrl = await this.oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            // Check if we have previously stored a token.
            this.token = fs.readFileSync(TOKEN_PATH);
            this.oAuth2Client.setCredentials(JSON.parse(this.token as unknown as string));
            this.setDrive(this.oAuth2Client);
        } catch (err) {
            console.log("authorize() Error");
            console.log(err);
        }
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    public async getAccessToken(code: string): Promise<void> {
        try{
            this.token = await this.oAuth2Client.getToken(code);
            this.oAuth2Client.setCredentials(this.token['tokens']);
            this.setDrive(this.oAuth2Client);
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(this.token['tokens']));
        } catch(err) {
            console.log("getAccessToken() Error");
            console.log(err);
        }
    }
    /**
     * Get the user Id of the corresponding user
     * @returns {userInfo.data.id} id of the user
     */
    public async getUserId(): Promise<string> {
        try{
            const auth = google.oauth2({auth: this.oAuth2Client, version: 'v2'});
            const userInfo = await auth.userinfo.get();
            if(userInfo) {
                return userInfo.data.id ?? "";
            }
        } catch (err) {
            console.log(err);
        }
        return "";
    }

}