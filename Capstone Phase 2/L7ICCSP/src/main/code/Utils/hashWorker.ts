import * as fs from "fs";
import CryptoJS from 'crypto-js';
const { parentPort } = require('worker_threads');

parentPort.on("message" , (file:any) => {
    const data = fs.readFileSync(file,"utf-8");
    console.log("In Worker Thread");
    // Returns the Hex string of the SHA256 hash
    let hash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
    console.log("Returning hash " + hash);
    parentPort.postMessage(hash);
});

