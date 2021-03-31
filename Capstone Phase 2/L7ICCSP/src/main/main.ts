import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { GoogleAuth } from "./code/authenticator/googleAuth";
import readline from 'readline';
import { GoogleAccessCloud } from "./code/cloud/google_access_cloud";
import { CloudOperations } from './code/cloud_operations'
import { LocalAccessStorage } from './code/storage/local_access_storage';
import { AccessStorage } from "./code/storage/access_storage";
import { constants } from "./code/utils/constants";
import jsonfile from "jsonfile";

import fs from 'fs';
// TODO Create a singleton pattern class with createWindow and other methods enclosed in it to avoid using global variables
let access_cloud: GoogleAccessCloud;
let operations: CloudOperations;

async function createWindow() {
    let tester = new GoogleAuth();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    await tester.authorize();
    if (!tester.isToken()) {
        const it = rl[Symbol.asyncIterator]();
        console.log("Access this url to get required code: ", tester.getAuthUrl());
        const code = await it.next();
        console.log("code: ", code);
        await tester.getAccessToken(code['value']);
        console.log("Token: ", tester.isToken());
    }
    rl.close();
    access_cloud = new GoogleAccessCloud(tester.getDrive());
    let files = await access_cloud.searchFile('L7ICCSP', "");
    if (files.length === 0) {
        await access_cloud.putFolder('L7ICCSP', "");
    }
    files = await access_cloud.searchFile('merkle', "");
    if (files.length === 0) {
        await access_cloud.putFolder('merkle', "");
    }
    const storage: AccessStorage = new LocalAccessStorage();
    operations = new CloudOperations(access_cloud, tester, storage);
    await operations.setUser();
    console.log("Operations Set")
    const win = new BrowserWindow({
        width: 1440,
        height: 1080,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    });
    win.loadFile('index.html');
    win.webContents.on('new-window', (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
    });
}

// Electron EndPoints
ipcMain.on('files', async (event, source) => {
    try {
        if (source === 'upload') {
            const fileObj = [];
            const files = await access_cloud.getDirList(constants.ROOTDIR);
    
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                const elements = element.split(",");
                const fileDate = new Date(elements[3])
                fileObj.push({
                    name: elements[0],
                    id: elements[1],
                    url: elements[2],
                    date: fileDate.toLocaleString()
                });
            }
            event.sender.send('list', fileObj);
        }
        else if (source === 'download') {
            // TODO fileSync error
            const conf = jsonfile.readFileSync(constants.CONFIG_PATH);
            const downloadsPath = conf.downloadsPath;
            let files = fs.readdirSync(downloadsPath);
            console.log("fetching list of files in ", downloadsPath);
            const fileObj = []
            for (let index = 0; index < files.length; index++) {
                const stats = fs.statSync(`${downloadsPath}/${files[index]}`);
                fileObj.push({
                    name: files[index],
                    id: index,
                    date: stats.mtime.toLocaleString()
                });
            }
            event.sender.send('list', fileObj);
        }
    } catch(err) {
        console.log("Fetch Files error");
        console.log(err);
        event.sender.send('list', []);
    }

});

ipcMain.on('uploadPath', async (event, filePath: string) => {
    console.log("initiating an upload to cloud for file ", filePath);
    const result = await operations.upload(filePath.replace(/\\/g, '/'), false, constants.ROOTDIR);
    event.sender.send('isUploadDone', result);

});

ipcMain.on('downloadFile', async (event, fileName, fileId) => {
    console.log("initiating download from cloud for file ", fileName, ",id ", fileId);
    const conf = jsonfile.readFileSync(constants.CONFIG_PATH);
    const downloadsPath = conf.downloadsPath;
    const result = await operations.download(downloadsPath, fileName, fileId);
    event.sender.send('isDownloadDone', result);
});

ipcMain.on('delete', (event, source, sourceId) => {
    let result = true;
    try {
        if (source === 'local') {
            const conf = jsonfile.readFileSync(constants.CONFIG_PATH);
            const downloadsPath = conf.downloadsPath;
            fs.unlinkSync(`${downloadsPath}/${sourceId}`);
        }
    } catch (err) {
        console.log("delete error");
        console.log(err);
        result = false;
    }
    event.sender.send('isDelete', result);
});

ipcMain.on('open', (_, filename) => {
    try {
        const conf = jsonfile.readFileSync(constants.CONFIG_PATH);
        let downloadsPath = conf.downloadsPath;
        if(downloadsPath.startsWith('.')){
            downloadsPath = path.resolve(downloadsPath);
        }
        shell.openPath(`${downloadsPath}/${filename}`).then((err) => {
            if(err) {
                console.log("OpenPath Error");
                console.log(err);
            }
        });
    } catch (err) {
        console.log("delete error");
        console.log(err);
    }
});

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})
