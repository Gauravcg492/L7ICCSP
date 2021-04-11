import { expect } from "chai";
import { CloudOperations } from "../main/code/cloud_operations";
import { constants } from "../main/code/utils/constants";
import { setUp, createFile, createFiles } from "./helper";
import * as fs from "fs";

describe("Operations Upload and Download large file", () => {
    let operations: CloudOperations;
    const size = 100;
    before(async () => {
        const promises = [];
        // const files = fs.readdirSync('test_data/');
        promises.push(createFile('test_data/file1', size));
        // promises.push(createFiles());
        operations = await setUp();
        try {
            await Promise.all(promises);
        } catch (err) {
            throw new Error(err);
        }
    });

    it(`Should upload a single file of size ${size}`, async () => {
        let result:boolean;
        try{
            result = await operations.upload('test_data/file1', false, constants.ROOTDIR);
        } catch(err) {
            result = false;
        }
        expect(result, 'Upload of single file failed').to.be.true;
    });

    it(`Should download a single file of size ${size}`, async () => {
        let result:boolean;
        try{
            const fileId = operations.getCloudClient().getFileId('file1');
            result = await operations.download('test_data', 'file1', fileId);
        } catch(err) {
            result = false;
        }
        expect(result, 'Download of single file failed').to.be.true;
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
