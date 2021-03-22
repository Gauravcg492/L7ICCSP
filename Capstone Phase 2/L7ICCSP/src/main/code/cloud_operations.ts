import { verify } from './utils/verifier'
import { sha256 } from "./utils/hashes"
import { AccessStorage } from "./storage/access_storage"
import { AccessCloud } from './cloud/access_cloud';
import { Authentication } from './authenticator/authentication';
import { constants } from './utils/constants';
import { Tree } from './tree/tree';
import { MerkleTree } from './tree/merkle_tree';
import fs from 'fs';
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
        console.log("id: ", this.id);
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

    /**
     * 
     * @param file Name of File
     * @param isFolder Boolean flag to indicate whether it is a folder or not
     * @param dir Location of the file in local
     * @returns 
     */
    async upload(file: string, isFolder = false, dir: string): Promise<boolean> {
        console.log("upload called");
        const promises = [];
        if ( isFolder ) {
            promises.push(this.cloudClient.putFolder(file, dir));
        } else {
            promises.push(this.cloudClient.putFile(file, dir));
        }
        const obj: any = {
            id: this.id,
            configPath: this.configPath
        }
        console.log("Obj: ", obj);
        const rootHash = this.storage.getRootHash(obj);
        console.log("RootHash");
        const merkleTree: Tree = new MerkleTree(rootHash, this.cloudClient);
        const fileHash = sha256(file);
        try{
            obj.hash = await merkleTree.addToTree(fileHash);
            this.storage.putRootHash(obj);
            const values = await Promise.all(promises);
            return values.every(Boolean);
        } catch(err) {
            console.log("CloudOperations.upload() error");
            console.log(err);
        }
        return false;
    }

    /**
     * 
     * @param localDir Local file directory : location to store downloads
     * @param filename Name of 
     * @returns 
     */
    async download(localDir: string, filename: string): Promise<boolean> {
        console.log("Starting Download");
        try{
            const result = await this.cloudClient.getFile(localDir, filename);
            if(result.length > 0) {
                const fileHash = sha256(result);
                const isAuthentic = await this.verify(fileHash);
                if(isAuthentic) {
                    console.log("File is Authentic");
                } else{
                    console.log("File is tampered");
                    // TODO delete file
                    fs.unlinkSync(result);
                }
                return true;
            }
        } catch(err) {
            console.log("CloudOperations.download() error");
            console.log(err);
        }
        return false;
    }
}