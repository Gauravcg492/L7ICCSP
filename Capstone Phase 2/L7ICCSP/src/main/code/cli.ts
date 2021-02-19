import { GoogleAuth } from "./authenticator/googleAuth"
import readline from 'readline'
import { GoogleAccessCloud } from "./cloud/google_access_cloud"

const main = async () => {
    let tester = new GoogleAuth();
    //setTimeout(function(){ alert("Hello") },15000);
    //let downloader = new GoogleAccessCloud(tester.getDrive());
    //downloader.getFile("temp");
    await tester.authorize();
    if(!tester.isToken()) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const it = rl[Symbol.asyncIterator]();
        console.log("Access this url to get required code: ", tester.getAuthUrl());
        const code = await it.next();
        console.log(code)
        tester.getAccessToken(code as unknown as string);
    }
}

main();