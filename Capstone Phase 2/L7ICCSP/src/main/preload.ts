import { ipcRenderer, contextBridge } from 'electron';
import { log } from './code/utils/logger';

contextBridge.exposeInMainWorld('api', {
    loginApi: {
        openLoginUrlOnBrowser() {
            ipcRenderer.send('openLoginUrlOnBrowser');
        },
        getLoginUrl() {
            return new Promise((resolve, _) => {
                ipcRenderer.on('getLoginUrl', (_: any, url: string) => {
                    resolve(url);
                });
            });
        },
        sendAccessToken(access_token: string){
            ipcRenderer.send('storeAccessToken',access_token);
        },
        getLoginStatus(){
            return new Promise((resolve, _) => {
                ipcRenderer.on('loginStatus', (_: any, isLoggedIn: boolean) => {
                    resolve(isLoggedIn);
                });
            });
        },
        doLogout(){
            ipcRenderer.send('logout');
        },
        requestUserInfo(){
            ipcRenderer.send('getUserInfo');
        },
        receiveUserInfo(){
            return new Promise((resolve, _) => {
                ipcRenderer.on('userinfo', (_: any, userinfo: any) => {
                    resolve(userinfo);
                });
            });
        }
    },
    filesApi: {
        fetchFiles(source: string) {
            ipcRenderer.send('files', source);
        },
        getFiles() {
            return new Promise((resolve, _) => {
                ipcRenderer.on('list', (_: any, fileObj: {}) => {
                    resolve(fileObj);
                });
            });
        },
        uploadAFile(filePath: string) {
            ipcRenderer.send('uploadPath', filePath);
        },
        isFileUploaded() {
            return new Promise((resolve, _) => {
                ipcRenderer.on('isUploadDone', (_: any, fileId: string) => {
                    resolve(fileId);
                });
            });
        },
        downloadAFile(fileName: string, fileId: string) {
            ipcRenderer.send('downloadFile', fileName, fileId);
        },
        isFileDownloaded() {
            return new Promise((resolve, _) => {
                ipcRenderer.on('isDownloadDone', (_: any, isDownloaded: boolean) => {
                    resolve(isDownloaded);
                });
            });
        },
        deleteFile(source: string, sourceId: string) {
            ipcRenderer.send('delete', source, sourceId);
        },
        isFileDeleted() {
            return new Promise((resolve, _) => {
                ipcRenderer.on('isDelete', (_, isDeleted: boolean) => {
                    resolve(isDeleted);
                })
            });
        },
        openFile(filename: string) {
            log("Filename: ", filename);
            ipcRenderer.send('open', filename);
        },
        isFileOpened() {
            return new Promise((resolve, _) => {
                ipcRenderer.on('isOpen', (_, isOpened: boolean) => {
                    resolve(isOpened);
                });
            });
        }

    }
})