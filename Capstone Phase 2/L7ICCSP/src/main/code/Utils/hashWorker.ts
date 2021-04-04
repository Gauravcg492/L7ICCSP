import * as fs from "fs";
import CryptoJS from 'crypto-js';
import { fileURLToPath } from "node:url";
const { parentPort } = require('worker_threads');

parentPort.on("message" , (filedata : any) => {
    const data = fs.readFileSync(filedata.data.fp,"utf-8");
    console.log("In Worker Thread");
    // Returns the Hex string of the SHA256 hash
    console.log("UserId : " + filedata.data.uid + "\nfilename : " + filedata.data.fn + "\nfilepath : " + filedata.data.fp);
    let hash = CryptoJS.SHA256(data + filedata.data.fn + filedata.data.uid).toString(CryptoJS.enc.Hex);
    console.log("Returning hash " + hash);
    parentPort.postMessage(hash);
});

