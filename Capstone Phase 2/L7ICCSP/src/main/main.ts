import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { GoogleAuth } from "./code/authenticator/googleAuth";
import readline from 'readline';
import { GoogleAccessCloud } from "./code/cloud/google_access_cloud";
import { CloudOperations } from './code/cloud_operations'
import { LocalAccessStorage } from './code/storage/local_access_storage';
import { AccessStorage } from "./code/storage/access_storage";
import { constants } from "./code/utils/constants";

let access_cloud: GoogleAccessCloud;
let operations: CloudOperations;

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, 
      preload: 'preload.js',
    }
  })

  win.loadFile('index.html')
}

// Electron EndPoints
ipcMain.on('files', async (event, source) => {
  if(source === 'upload') {
    const files = await access_cloud.getDirList(constants.ROOTDIR);
    let f = [
      {"id":"id", "name":"name"}
    ]
    const fileObj = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const elements = element.split(",");
      fileObj.push({
        "id": elements[1],
        "name": elements[0]
      });    
    }
    event.sender.send('list', fileObj);
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
    const storage: AccessStorage = new LocalAccessStorage();
    operations = new CloudOperations(access_cloud, tester, storage);
    createWindow()
  }
})
