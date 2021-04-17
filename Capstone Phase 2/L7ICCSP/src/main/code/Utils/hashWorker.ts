import * as fs from "fs";
import CryptoJS from 'crypto-js';
import { log } from "./logger";
const { parentPort } = require('worker_threads');

parentPort.on("message" , (filedata : any) => {
    log(filedata);
    const data = fs.readFileSync(filedata.fp,"utf-8");
    
    log("In Worker Thread");
    // Returns the Hex string of the SHA256 hash
    log("UserId : " + filedata.uid + "\nfilename : " + filedata.fn + "\nfilepath : " + filedata.fp);
    let hash = CryptoJS.SHA256(data + filedata.fn + filedata.uid).toString(CryptoJS.enc.Hex);
    log("Returning hash " + hash);
    parentPort.postMessage(hash);
});

