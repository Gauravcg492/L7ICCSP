import { AccessStorage, ConfigInput, HashInput } from "./access_storage";
import jsonfile from "jsonfile";

// Implements AccessStorage Interface to access root hash in local file system
class LocalAccessStorage implements AccessStorage {
    // Function handles fetching of root hash from local file system
    // Returns root hash if found else returns empty string
    getRootHash(obj: ConfigInput): string {
        try {
            const conf = jsonfile.readFileSync(obj.configPath);
            const file = conf.rootHash.directory + conf.rootHash.filename;
            const details = jsonfile.readFileSync(file);
            if (details && details[obj.id]) {
                return details[obj.id].hash;
            }
        } catch (error) {
            console.log(error);
        }
        return "";
    }

    // Function which adds root hash onto local file system 
    putRootHash(obj: ConfigInput & HashInput): void {
        try {
            const conf = jsonfile.readFileSync(obj.configPath);
            const file = conf.rootHash.directory + conf.rootHash.filename;
            jsonfile
                .readFile(file)
                .then((details) => {
                    details[obj.id] = {
                        hash: obj.hash,
                    };
                    jsonfile.writeFileSync(file, details);
                })
                .catch((err) => {
                    console.log(err);
                    const newObj: any = {};
                    newObj[obj.id] = {
                        hash: obj.hash,
                    };
                    jsonfile.writeFileSync(file, newObj);
                });
        } catch (error) {
            console.log(error);
        }
    }
}

// console.log("testing packages");
// const some = new LocalAccessStorage();
// const obj = {
//     id: "id",
//     hash: "hash",
//     configPath: "config.json",
// };
// // some.putRootHash(obj);
// const output = some.getRootHash({
//     id: "id2",
//     "configPath": 'config.json'
// });
// console.log(output)