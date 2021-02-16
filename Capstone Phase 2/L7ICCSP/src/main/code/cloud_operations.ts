import { verify } from './cloud/verify'
import { AccessStorage } from "./storage/access_storage"
import { sha256 } from "./utils/hashes"
// Class which handles upload and download
class CloudOperations{
    //Return types can be further refined
    constructor()
    {

    }
    
    private verify(storage : AccessStorage,filehash : string): Boolean
    {
        const obj = {
                 id: "id2",
                 "configPath": 'config.json'
         };
        const root_hash = storage.getRootHash(obj);
        return verify(filehash,root_hash);
    }

    upload(): void
    {

    }
    download(): any
    {

    }
}