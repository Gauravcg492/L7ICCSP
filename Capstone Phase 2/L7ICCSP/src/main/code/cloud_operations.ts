import { verify } from './utils/verifier'
import { sha256, sha256V2 } from "./utils/hashes"
import { AccessStorage } from "./storage/access_storage"
import { AccessCloud } from './cloud/access_cloud';
import { Authentication } from './authenticator/authentication';
import { constants } from './utils/constants';
import { Tree } from './tree/tree';
import { MerkleTree } from './tree/merkle_tree';
import fs from 'fs';
import { log } from './utils/logger';

// Class which handles upload and download
export class CloudOperations {

    private id: string;
    private configPath: string;
    //Return types can be further refined
    constructor(private cloudClient: AccessCloud, private authentication: Authentication, private storage: AccessStorage) {
        this.id = "";
        this.configPath = constants.CONFIG_PATH;
    }

    /**
     * Sets the user id
     */
    public async setUser(): Promise<void> {
        this.id = await this.authentication.getUserId();
        log("id: ", this.id);
    }

    /**
     * 
     * @param filehash Hash of file
     * @returns verify's the authenticity of the file and returns true if file is authentic
     */
    private async verify(filehash: string): Promise<boolean> {
        const rootHash = this.storage.getRootHash({
            id: this.id,
            configPath: this.configPath
        });
        return await verify(filehash, rootHash, this.cloudClient);
    }

    public getCloudClient(): AccessCloud {
        return this.cloudClient;
    }

    /**
     * 
     * @param file Name of File
     * @param isFolder Boolean flag to indicate whether it is a folder or not
     * @param dir Location of the file in local
     * @returns 
     */
    async upload(file: string, isFolder = false, dir: string): Promise<boolean> {
        log("upload called");
        const promises = [];
        if (isFolder) {
            return await this.cloudClient.putFolder(file, dir);
        } else {
            promises.push(this.cloudClient.putFile(file, dir));
        }
        const obj: any = {
            id: this.id,
            configPath: this.configPath
        }
        log("Obj: ", obj);
        const rootHash = this.storage.getRootHash(obj);
        log("RootHash");
        const merkleTree: Tree = new MerkleTree(rootHash, this.cloudClient);
        try {
            const fileArr = file.split("/");
            let filename = fileArr[fileArr.length - 1];
            const result = await this.cloudClient.searchFile(filename, "");
            if(result.length != 0) {
                filename = Date.now().toString() + filename;
            }
            const fileHash = await sha256V2(file, filename, this.id);
            obj.hash = await merkleTree.addToTree(fileHash);
            const values = await Promise.all(promises);
            if(values.every(Boolean)) {
                let result = await merkleTree.updateMerkle();
                if(result){
                    this.storage.putRootHash(obj);
                    return true;
                } else {
                    // TODO handle failure of updating of merkletrees
                    const fileId = this.cloudClient.getFileId(filename);
                    await this.cloudClient.deleteFile(fileId);
                }
            }
        } catch (err) {
            log("CloudOperations.upload() error");
            log(err);
        }
        return false;
    }

    /**
     * 
     * @param localDir Local file directory : location to store downloads
     * @param filename Name of 
     * @returns 
     */
    async download(localDir: string, filename: string, fileId: string): Promise<boolean> {
        log("Starting Download");
        try {
            const result = await this.cloudClient.getFile(localDir, fileId);
            if (result.length > 0) {
                const fileHash = await sha256V2(result, filename, this.id);
                const isAuthentic = await this.verify(fileHash);
                if (isAuthentic) {
                    let filePath = `${localDir}/${filename}`;
                    if (fs.existsSync(filePath)) {
                        filePath = `${localDir}/${Date.now()}${filename}`;
                    }
                    fs.renameSync(`${localDir}/${fileId}`, filePath);
                    log("File is Authentic");
                } else {
                    log("File is tampered");
                    fs.unlinkSync(result);
                    return false;
                }
                return true;
            }
        } catch (err) {
            log("CloudOperations.download() error");
            log(err);
        }
        return false;
    }
}