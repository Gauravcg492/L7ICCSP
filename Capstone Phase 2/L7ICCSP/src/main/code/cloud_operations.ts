import { verify } from './utils/verifier'
import { sha256 } from "./utils/hashes"
import { AccessStorage } from "./storage/access_storage"
import { AccessCloud } from './cloud/access_cloud';
import { Authentication } from './authenticator/authentication';
import { constants } from './utils/constants';
import { Tree } from './tree/tree';
import { MerkleTree } from './tree/merkle_tree';
// Class which handles upload and download
export class CloudOperations {

    private id: string;
    private configPath: string;
    //Return types can be further refined
    constructor(private cloudClient: AccessCloud, private authentication: Authentication, private storage: AccessStorage) { 
        this.id = "";
        this.configPath = constants.CONFIG_PATH;
    }

    public async setUser(): Promise<void> {
        this.id = await this.authentication.getUserId();
    }

    private async verify(filehash: string): Promise<Boolean> {
        const rootHash = this.storage.getRootHash({
            id: this.id,
            configPath: this.configPath
        });
        return await verify(filehash, rootHash, this.cloudClient);
    }

    async upload(file: string, isFolder = false, dir: string): Promise<void> {
        console.log("upload called");
        if ( isFolder ) {
            this.cloudClient.putFolder(file, dir);
        } else {
            this.cloudClient.putFile(file, dir);
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
        obj.hash = await merkleTree.addToTree(fileHash);
        this.storage.putRootHash(obj);
    }
    download(): any {

    }
}