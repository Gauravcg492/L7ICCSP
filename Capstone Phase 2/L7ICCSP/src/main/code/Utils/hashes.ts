import CryptoJS from 'crypto-js';
import * as fs from "fs";

module.exports = function sha256(File : string){
    const data = fs.readFileSync(File,"utf-8");
    return CryptoJS.SHA256(data);
}

