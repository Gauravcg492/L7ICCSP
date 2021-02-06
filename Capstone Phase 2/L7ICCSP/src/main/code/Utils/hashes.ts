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

// Given 2 Hash compute a single Hash
// Use Case : Compute the Hash of Intermediate Nodes
export function concat(s1: string, s2: string){
    var s;
    // Concate the Hash in the order lexicgraphically least followed by other hash.
    if(s1.localeCompare(s2)){
        s = s2.concat(s1.toString());
    }
    else{
        s = s1.concat(s2.toString());
    }
    return CryptoJS.SHA256(s).toString(CryptoJS.enc.Hex);
}

