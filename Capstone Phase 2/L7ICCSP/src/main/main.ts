import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
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
	// let tester = new GoogleAuth();
	// const rl = readline.createInterface({
	// 	input: process.stdin,
	// 	output: process.stdout,
	// });
	// await tester.authorize();
	// if (!tester.isToken()) {
	// 	const it = rl[Symbol.asyncIterator]();
	// 	console.log("Access this url to get required code: ", tester.getAuthUrl());
	// 	const code = await it.next();
	// 	console.log("code: ", code);
	// 	await tester.getAccessToken(code['value']);
	// 	console.log("Token: ", tester.isToken());
	// }
	// rl.close();
	// access_cloud = new GoogleAccessCloud(tester.getDrive());
	// let files = await access_cloud.searchFile('L7ICCSP', "");
	// if (files.length === 0) {
	// 	await access_cloud.putFolder('L7ICCSP', "");
	// }
	// files = await access_cloud.searchFile('merkle', "");
	// if (files.length === 0) {
	// 	await access_cloud.putFolder('merkle', "");
	// }
	// const storage: AccessStorage = new LocalAccessStorage();
	// operations = new CloudOperations(access_cloud, tester, storage);
	// console.log("Operations Set")
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js'),
		}
	});
	win.loadFile('index.html')
}

// Electron EndPoints
ipcMain.on('files', async (event, source) => {
	if (source === 'upload') {
		const fileObj = [{id: "101", name: "dummy"}, 
			{id: "102", name: "dummy2"},
			{id: "103", name: "dummy3"}
		];
		// const files = await access_cloud.getDirList(constants.ROOTDIR);
		
		// for (let index = 0; index < files.length; index++) {
		// 	const element = files[index];
		// 	const elements = element.split(",");
		// 	fileObj.push({
		// 		name: elements[0],
		// 		id: elements[1]
		// 	});
		// }
		event.sender.send('list', fileObj);
	}
	else if (source === 'download') {
		const conf = jsonfile.readFileSync(constants.CONFIG_PATH);
        const downloadsPath = conf.downloadsPath;
		let files = fs.readdirSync(downloadsPath);
		console.log("fetching list of files in ",downloadsPath);
		const fileObj = []
		for (let index = 0; index < files.length; index++) {
				fileObj.push({
					name: files[index] ,
					id: index
				});
		}
		event.sender.send('list', fileObj);
	}

});

ipcMain.on('uploadPath', async (event, filePath) => {
		console.log("initiating an upload to cloud for file ",filePath);
		//TODO call upload api
		const fileId = "xxx";
		event.sender.send('isUploadDone', fileId);

});

ipcMain.on('downloadFile', async (event, fileName, fileId) => {
	console.log("initiating an download from cloud for file ",fileName,",id ",fileId);
	//TODO call download api
	event.sender.send('isDownloadDone', true);
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
