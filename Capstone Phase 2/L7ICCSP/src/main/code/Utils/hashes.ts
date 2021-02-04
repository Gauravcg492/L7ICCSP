import CryptoJS from 'crypto-js';
import * as fs from "fs";

export function sha256(File : string){
    const data = fs.readFileSync(File,"utf-8");
    console.log(data);
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

//console.log("starting")
// console.log(sha256('/Users/skedilay/Desktop/test.txt'))

export function concat(s1: string, s2: string){
    var s;
    if(s1.localeCompare(s2)){
        s = s2.concat(s1.toString());
    }
    else{
        s = s1.concat(s2.toString());
    }
    return CryptoJS.SHA256(s).toString(CryptoJS.enc.Hex);
}

//console.log(concat("san", "ked"))
