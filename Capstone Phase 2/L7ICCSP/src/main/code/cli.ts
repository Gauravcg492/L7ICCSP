import { GoogleAuth } from "./authenticator/googleAuth";
import readline from 'readline';
import { GoogleAccessCloud } from "./cloud/google_access_cloud";
import { CloudOperations } from './cloud_operations'
import { LocalAccessStorage } from './storage/local_access_storage';
import { AccessStorage } from "./storage/access_storage";
import { constants } from "./utils/constants";

const main = async () => {
    let tester = new GoogleAuth();
    //setTimeout(function(){ alert("Hello") },15000);
    //let downloader = new GoogleAccessCloud(tester.getDrive());
    //downloader.getFile("temp");
    // const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    // });
    // await tester.authorize();
    // if (!tester.isToken()) {
    //     const it = rl[Symbol.asyncIterator]();
    //     console.log("Access this url to get required code: ", tester.getAuthUrl());
    //     const code = await it.next();
    //     console.log("code: ", code);
    //     await tester.getAccessToken(code['value']);
    //     console.log("Token: ", tester.isToken());
    // }
    // rl.close();
    // const access_cloud = new GoogleAccessCloud(tester.getDrive());
    // // Search for main files and create them if not present
    // console.log("Search file");
    // let files = await access_cloud.searchFile('L7ICCSP', "");
    // if(files.length === 0) {
    //     await access_cloud.putFolder('L7ICCSP', "");
    // }
    // files = await access_cloud.searchFile('merkle', "");
    // if(files.length === 0) {
    //     await access_cloud.putFolder('merkle', "");
    // }
    // console.log("List file")
    // files = await access_cloud.getDirList(constants.ROOTDIR);
    // // console.log(files);
    // // access_cloud.getFile('downloads/', files[files.length - 1], (file: string) => {
    // //     console.log("Calling callback: ", file);
    // //     const hash = sha256(file);
    // //     console.log("The hash is: ", hash);
    // // });
    // // const tree = new MerkleTree("", access_cloud);
    // // const fileHash = sha256('/Users/ar-gaurav.cg/Downloads/Resume.docx');
    // // let rootHash = await tree.addToTree(fileHash);
    // // console.log(rootHash);
    // const storage: AccessStorage = new LocalAccessStorage();
    // const operations = new CloudOperations(access_cloud, tester, storage);
    // await operations.setUser();
    // // await operations.upload('config.json', false, constants.ROOTDIR);
    // // await operations.upload('credentials.json', false, constants.ROOTDIR);
    // // await operations.upload('details.json', false, constants.ROOTDIR);
    // // await operations.upload('index.html', false, constants.ROOTDIR);
    // // await operations.upload('package.json', false, constants.ROOTDIR);
    // // await operations.upload('token.json', false, constants.ROOTDIR);
    // // await operations.upload('tsconfig.json', false, constants.ROOTDIR);
    // // await operations.upload('yarn.lock', false, constants.ROOTDIR);
    // // await operations.upload('webpack.common.js', false, constants.ROOTDIR);
    // // console.log('Upload done');
    //operations.download("C:/Users/GAURAV C G/Desktop/Work/L7ICCSP/Capstone Phase 2/L7ICCSP/temp", "config.json");
}

main();