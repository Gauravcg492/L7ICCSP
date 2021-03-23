import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
  notificationApi: {
    sendNotification(message: string) {
      ipcRenderer.send('notify', message);
    }
  },
  batteryApi: {

  },
  filesApi: {
    fetchFiles(source:string) {
        ipcRenderer.send('files', source);
    },
    getFiles() {
        return new Promise((resolve, _) => {
            ipcRenderer.on('list', (_:any, fileObj: {}) => {
                resolve(fileObj);
            });
        });
    }
  }
})