import CryptoJS from 'crypto-js';
import * as fs from "fs";

// Returns the SHA256 hash of a given file
export function sha256(File : string){
    // Read File in synchronous way
    // Executing Js program stops until file is read
    const data = fs.readFileSync(File,"utf-8");

    // Returns the Hex string of the SHA256 hash
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

// Compares 2 64 character strings
// Returns True if first string is larger than 2nd String
// Returns False in all other cases
function compare2Strings(s1 : string,s2 : string){
    let len = 64;
    for (let i = 0; i < len; i++){
        if ((s1[i].charCodeAt(0) - s2[i].charCodeAt(0)) > 0){
            return true;
        }
        else if ((s1[i].charCodeAt(0) - s2[i].charCodeAt(0)) < 0){
            return false;
        }
    }
    return false;
}

// Given 2 Hash compute a single Hash
// Use Case : Compute the Hash of Intermediate Nodes
export function concat(s1: string, s2: string){
    var s;
    // Concate the Hash in the order lexicgraphically least followed by other hash.
    if(compare2Strings(s1,s2)){
        s = s2.concat(s1.toString());
    }
    else{
        s = s1.concat(s2.toString());
    }
    console.log(s);
    return CryptoJS.SHA256(s).toString(CryptoJS.enc.Hex);
}

// let a = "a9df5381f1d9c454ae92e83afe5ff536bcef949254e61fa8f2ff3721e7ee6611";
// let b = "bff0d3f4caf91b0ec6745c12f6435b2344958881e8cfc4bd450b7afb2fa18be0";
// console.log(concat(b, a));