import * as fs from "fs";
import CryptoJS from 'crypto-js';
const { parentPort } = require('worker_threads');

parentPort.on("message" , (filedata : any) => {
    console.log(filedata);
    const data = fs.readFileSync(filedata.fp,"utf-8");
    
    console.log("In Worker Thread");
    // Returns the Hex string of the SHA256 hash
    console.log("UserId : " + filedata.uid + "\nfilename : " + filedata.fn + "\nfilepath : " + filedata.fp);
    let hash = CryptoJS.SHA256(data + filedata.fn + filedata.uid).toString(CryptoJS.enc.Hex);
    console.log("Returning hash " + hash);
    parentPort.postMessage(hash);
});

