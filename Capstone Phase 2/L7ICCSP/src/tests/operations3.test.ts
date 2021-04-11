import { expect } from "chai";
import { CloudOperations } from "../main/code/cloud_operations";
import { constants } from "../main/code/utils/constants";
import { setUp, createFile, createFiles } from "./helper";
import * as fs from "fs";

describe("Operations Upload and Download multiple files", () => {
    let operations: CloudOperations;
    const count = 20;
    before(async () => {
        const promises = [];
        // const files = fs.readdirSync('test_data/');
        // promises.push(createFile('test_data/file1', 1));
        promises.push(createFiles(20));
        operations = await setUp();
        try {
            await Promise.all(promises);
        } catch (err) {
            throw new Error(err);
        }
    });

    it(`Should upload ${count} files successfully`, async () => {
        let result: boolean;
        try {
            for (let i = 1; i <= count; i++) {
                result = await operations.upload('test_data/file'+i, false, constants.ROOTDIR);
                expect(result, `Upload of file${i} failed`).to.be.true;
            }
        } catch (err) {
            expect(false, `Upload of files failed`).to.be.true;
        }
    });

    it(`Should download ${count} files successfully`, async () => {
        let result: boolean;
        try {
            for (let i = 1; i <= count; i++) {
                const fileId = operations.getCloudClient().getFileId('file'+i);
                result = await operations.download('test_data', 'file'+i, fileId);
                expect(result, `Download of file${i} failed`).to.be.true;
            }
        } catch (err) {
            expect(false, 'Download of files failed').to.be.true;
        }
    });

    after(async () => {
        let fileID = operations.getCloudClient().getFileId('L7ICCSP');
        await operations.getCloudClient().deleteFile(fileID);
        fileID = operations.getCloudClient().getFileId('merkle');
        await operations.getCloudClient().deleteFile(fileID);
        fs.writeFileSync('./details.json', "{}");
        const files = fs.readdirSync('./test_data');
        for (let file of files) {
            fs.unlinkSync('./test_data/' + file);
        }
    });
});
