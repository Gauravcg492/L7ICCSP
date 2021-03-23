const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send('notify', message);
    }
  },
  batteryApi: {

  },
  filesApi: {
    fetchFiles(source) {
        ipcRenderer.send('files', source);
    },
    getFiles() {
        return new Promise((resolve, _) => {
            ipcRenderer.on('list', (_, fileObj) => {
                resolve(fileObj);
            });
        });
    }
  }
})