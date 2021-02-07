# Layer 7 Integrity Check For Cloud Service Providers (L7ICCSP)

+ To Create a system that maintains the integrity of files that are hosted on the cloud by untrusted servers.

+ We intend to implement a software solution that ensures the integrity of the files hosted on the cloud by untrusted servers and support a range of cloud services like Google Drive, Dropbox, OneDrive, Mediafire, Mega etc.

+ We intend to start our work on cloud provides which have good documentation and effective api’s for developers to use.


## drive cli

+ get credentials.json from here : https://developers.google.com/drive/api/v3/quickstart/nodejs

### instructions 

+ dependency
```
npm install googleapis@39 --save
```
+ list files
```
node list.js
```
+ download files
```
node download.js <fileid> <filename>
```
+ upload files
```
node upload.js <filepath>
```
