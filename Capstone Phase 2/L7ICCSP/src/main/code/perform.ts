import { constants } from "./utils/constants";
import { setUp, createFile, createFiles, cloudCleanUp } from "./helper";
import * as fs from "fs";


async function runBenchMark(initialCount: number, fileSize: number): Promise<void> {
    console.log(`Uploading/Downloading file of size ${fileSize}mb after inserting ${initialCount} files`);
    try {
        if (await createFiles(initialCount)) {
            console.log(`Created ${initialCount} no. of files`);
            const operations = await setUp();
            for (let i = 1; i <= initialCount; i++) {
                await operations.upload(`test_data/file${i}`, false, constants.ROOTDIR);
            }
            console.log(`Uploaded ${initialCount} no. of files`);
            const filename = `test_data/file${initialCount + 1}`;
            await createFile(filename, fileSize);
            // Upload
            console.log(`Uploading file of size: ${fileSize}mb`);
            // Google upload
            let content = `Google Upload API`;
            console.time(content);
            await operations.getCloudClient().putFile(filename, 'test');
            console.timeEnd(content);

            // L7ICCSP
            content = `L7ICCSP Upload API`;
            console.time(content);
            await operations.upload(filename, false, constants.ROOTDIR);
            console.timeEnd(content);

            // Download
            console.log(`Downloading file of size: ${fileSize}mb`);
            const fileId = operations.getCloudClient().getFileId(`file${initialCount + 1}`);
            // Google upload
            content = `\nGoogle Download API`;
            console.time(content);
            await operations.getCloudClient().getFile('test_data', fileId);
            console.timeEnd(content);
            fs.renameSync(`test_data/${fileId}`, `test_data/temp`);
            // L7ICCSP
            content = `\nL7ICCSP Download API`;
            console.time(content);
            await operations.download(`test_data`, `file${initialCount + 1}`, fileId);
            console.timeEnd(content);
            cloudCleanUp(operations);
        }
    } catch (err) {
        console.log("Benchmark error");
        console.log(err);
    }
};

runBenchMark(10, 200);
