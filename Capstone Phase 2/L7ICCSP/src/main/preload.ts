import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
    loginApi: {
        requestLoginUrl() {
            ipcRenderer.send('getLoginUrl');
        },
        sendAccessToken(access_token: string){
            ipcRenderer.send('accessToken',access_token);
        },
        isAuthSuccess(){
            return new Promise((resolve, _) => {
                ipcRenderer.on('authStatus', (_: any, authDone: boolean) => {
                    resolve(authDone);
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
            console.log("Filename: ", filename);
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