import { GoogleAuth } from "./authenticator/googleAuth"
import { GoogleAccessCloud } from "./cloud/google_access_cloud"

let tester = new GoogleAuth();
let downloader = new GoogleAccessCloud(tester.getDrive());
downloader.getFile("temp");
