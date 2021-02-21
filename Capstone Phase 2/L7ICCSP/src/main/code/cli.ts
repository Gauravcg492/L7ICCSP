import { GoogleAuth } from "./authenticator/googleAuth";
import readline from 'readline';
import { GoogleAccessCloud } from "./cloud/google_access_cloud";
import { sha256 } from "./utils/hashes";

function f2() {
    console.log("f2 called");
}
const f1 = (f2: any) => {
    f2();
}
const main = async () => {
    let tester = new GoogleAuth();
    //setTimeout(function(){ alert("Hello") },15000);
    //let downloader = new GoogleAccessCloud(tester.getDrive());
    //downloader.getFile("temp");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    await tester.authorize();
    if (!tester.isToken()) {
        const it = rl[Symbol.asyncIterator]();
        console.log("Access this url to get required code: ", tester.getAuthUrl());
        const code = await it.next();
        console.log("code: ", code)
        tester.getAccessToken(code['value']);
        console.log("Token: ", tester.isToken());
    }
    rl.close();
    const access_cloud = new GoogleAccessCloud(tester.getDrive());
    let files = await access_cloud.getDirList();
    console.log(files);
    // access_cloud.getFile('downloads/', files[files.length - 1], (file: string) => {
    //     console.log("Calling callback: ", file);
    //     const hash = sha256(file);
    //     console.log("The hash is: ", hash);
    // });
    files = await access_cloud.searchFile('merkle');
    console.log("files: ", files)
}

main();