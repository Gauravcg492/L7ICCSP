import { expect } from "chai";
import { CloudOperations } from '../src/main/code/cloud_operations';
import { constants } from "../src/main/code/utils/constants";
import { createFiles, setUp } from "./test_helper";
import * as fs from "fs";

describe("Operations Unit Testing", () => {
    let operations: CloudOperations;
    before(async () => {
        const promises = [];
        const files = fs.readdirSync('./data/');
        if(files.length != 100) {
            promises.push(createFiles());
        }
        operations = await setUp();
        try {
            await Promise.all(promises);
        } catch(err) {
            throw new Error(err);
        }
    });

    it('Should upload a single file', async () => {

    });
});
