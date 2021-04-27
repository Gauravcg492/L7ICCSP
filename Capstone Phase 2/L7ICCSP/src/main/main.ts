import { app, BrowserWindow, ipcMain, ipcRenderer, shell } from 'electron';
import path from 'path';
import { GoogleAuth } from "./code/authenticator/googleAuth";
import { GoogleAccessCloud } from "./code/cloud/google_access_cloud";
import { CloudOperations } from './code/cloud_operations'
import { LocalAccessStorage } from './code/storage/local_access_storage';
import { AccessStorage } from "./code/storage/access_storage";
import { constants } from "./code/utils/constants";
import jsonfile from "jsonfile";
import fs from 'fs';
import { log } from './code/utils/logger';

// TODO handle global variables(singleton class)
let access_cloud: GoogleAccessCloud;
let operations: CloudOperations;
var loggedIn = false;
let tester: GoogleAuth;

var win: BrowserWindow;
var loginWin: BrowserWindow;

const TOKEN_PATH = 'token.json';

async function createWindow() {
    tester = new GoogleAuth();
    // const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    // });
    await tester.authorize();
    // if (!tester.isToken()) {
    //     // const it = rl[Symbol.asyncIterator]();
    //     log("Access this url to get required code: ", tester.getAuthUrl());
    //     const code = await it.next();
    //     log("code: ", code);
    //     await tester.getAccessToken(code['value']);
    //     log("Token: ", tester.isToken());
    // }
    // rl.close();

    console.log("Operations Set")
    
    if(isLoggedIn()){
        setWin();
    }else{
    setLoginWin();
    }
}

if (process.env.RELOAD) {
    require('electron-reloader')(module, {
        debug: true,
        ignore: ['temp|[/\\]\./;', 'test_data|[/\\]\./;', 'details.json']
    });
}

// Electron EndPoints
ipcMain.on('openLoginUrlOnBrowser', async (event) => {
    console.log("request to fetch login url");
    const url = tester.getAuthUrl();
    shell.openExternal(url);
});

ipcMain.on('storeAccessToken', async (event, access_token: string) => {
    console.log("access_token received ", access_token);
    await tester.getAccessToken(access_token);
    if (isLoggedIn()) {
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
        loginToWin();
    }
    console.log("login status after accesstoken storage : ",isLoggedIn());
    event.sender.send('loginStatus', isLoggedIn());
});

ipcMain.on('isUserLoggedIn', async (event) => {
    event.sender.send('loginStatus', isLoggedIn());
});

ipcMain.on('getUserInfo', async (event) => {
    const userInfo = tester.getUserInfo();
    console.log(userInfo);
    event.sender.send('userinfo',userInfo);
});

ipcMain.on('files', async (event, source) => {
    const fileObj = [];
    try {
        if (source === 'upload') {
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
        }
        else if (source === 'download') {
            const conf = jsonfile.readFileSync(constants.CONFIG_PATH);
            const downloadsPath = conf.downloadsPath;
            let files = fs.readdirSync(downloadsPath);
            log("fetching list of files in ", downloadsPath);
            for (let index = 0; index < files.length; index++) {
                const stats = fs.statSync(`${downloadsPath}/${files[index]}`);
                fileObj.push({
                    name: files[index],
                    id: index,
                    date: stats.mtime.toLocaleString()
                });
            }
        }
        event.sender.send('list', fileObj);
    } catch (err) {
        log("Fetch Files error");
        log(err);
        event.sender.send('list', []);
    }

});

ipcMain.on('uploadPath', async (event, filePath: string) => {
    log("initiating an upload to cloud for file ", filePath);
    const result = await operations.upload(filePath.replace(/\\/g, '/'), false, constants.ROOTDIR);
    event.sender.send('isUploadDone', result);
});

ipcMain.on('downloadFile', async (event, fileName, fileId) => {
    log("initiating download from cloud for file ", fileName, ",id ", fileId);
    const conf = jsonfile.readFileSync(constants.CONFIG_PATH);
    const downloadsPath = conf.downloadsPath;
    const result = await operations.download(downloadsPath, fileName, fileId);
    event.sender.send('isDownloadDone', result);
});

ipcMain.on('delete', async (event, source, sourceId) => {
    let result = true;
    try {
        if (source === 'local') {
            const conf = jsonfile.readFileSync(constants.CONFIG_PATH);
            const downloadsPath = conf.downloadsPath;
            fs.unlinkSync(`${downloadsPath}/${sourceId}`);
        } else if (source === 'drive') {
            result = await access_cloud.deleteFile(sourceId);
        }
    } catch (err) {
        log("delete error");
        log(err);
        result = false;
    }
    event.sender.send('isDelete', result);
});

ipcMain.on('open', async (event, filename) => {
    let result = true;
    try {
        const conf = jsonfile.readFileSync(constants.CONFIG_PATH);
        let downloadsPath = conf.downloadsPath;
        if (downloadsPath.startsWith('.')) {
            downloadsPath = path.resolve(downloadsPath);
        }
        const err = await shell.openPath(`${downloadsPath}/${filename}`);
        if (err.length > 0) {
            throw new Error(err);
        }
    } catch (err) {
        log("Open error");
        log(err);
        result = false;
    }
    event.sender.send('isOpen', result);
});
//TODO logout
// 1.Remove token.json
// 2.run "await tester.authorize()"
// 3. ToggleWindow

ipcMain.on('logout', async(event) => {
    log("logging out user");
    fs.unlinkSync(TOKEN_PATH);
    await tester.authorize();
    winToLogin();
})

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


function isLoggedIn() {
    return tester.isToken();
}

function loginToWin() {
    setWin();
    loginWin.close();
}

function winToLogin() {
    setLoginWin();
    win.close();
}

function setWin(){
    win = new BrowserWindow({
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

function setLoginWin(){
    loginWin = new BrowserWindow(
        {
            width: 720,
            height: 720,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js'),
            },
        }
    );
    loginWin.loadFile('login.html')
}