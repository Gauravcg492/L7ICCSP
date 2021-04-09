import { expect } from "chai";
import { CloudOperations } from "../main/code/cloud_operations";
import { constants } from "../main/code/utils/constants";
import { setUp, createFile, createFiles } from "./helper";
import * as fs from "fs";

describe("Operations Upload and download files", () => {
    let operations: CloudOperations;
    let count = 10;
    before(async () => {
        const promises = [];
        // const files = fs.readdirSync('test_data/');
        // promises.push(createFile('test_data/file1', 1));
        promises.push(createFiles(count));
        operations = await setUp();
        try {
            await Promise.all(promises);
        } catch (err) {
            throw new Error(err);
        }
    });

    it('Should download all files for every file uploaded', async () => {
        let result:boolean;
        try{
            for(let i=1; i<= count; i++) {
                result = await operations.upload('test_data/file'+i, false, constants.ROOTDIR);
                expect(result, `Upload of file${i} failed`).to.be.true;
                const files = await operations.getCloudClient().getDirList(constants.ROOTDIR);
                for(let file of files) {
                    const fileArr = file.split(',');
                    result = await operations.download('test_data', fileArr[0], fileArr[1]);
                    expect(result, `Download of ${fileArr[0]} failed`).to.be.true;
                }
            }
        } catch(err) {
            result = false;
            expect(false, 'Upload and download of files failed').to.be.true;
        }
    });

    after(async () => {
        let fileID = operations.getCloudClient().getFileId('L7ICCSP');
        await operations.getCloudClient().deleteFile(fileID);
        fileID = operations.getCloudClient().getFileId('merkle');
        await operations.getCloudClient().deleteFile(fileID);
        fs.writeFileSync('./details.json', "{}");
        const files = fs.readdirSync('./test_data');
        for(let file of files) {
            fs.unlinkSync('./test_data/' + file);
        }
    });
});
