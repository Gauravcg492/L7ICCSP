import { verify } from './utils/verifier'
import { sha256 } from "./utils/hashes"
import { AccessStorage } from "./storage/access_storage"
import { AccessCloud } from './cloud/access_cloud';
import { Authentication } from './authenticator/authentication';
import { constants } from './utils/constants';
import { Tree } from './tree/tree';
// Class which handles upload and download
class CloudOperations {

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

    upload(file: string, isFolder = false, dir: string): void {
        if ( isFolder ) {
            this.cloudClient.putFolder(file, dir);
        } else {
            this.cloudClient.putFile(file, dir);
        }
        const rootHash = this.storage.getRootHash({
            id: this.id,
            configPath: this.configPath
        });


    }
    download(): any {

    }
}