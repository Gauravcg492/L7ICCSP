import { parseNode } from './nodeParser'
import { concat } from './hashes';
import { AccessCloud } from '../cloud/access_cloud';
import { constants } from './constants';
import { log } from './logger';


function chooseNode(searchArray: string[], hashFile: string): string {
    for(let index = 0; index < searchArray.length; index++) {
        if(parseNode(searchArray[index])[0] === hashFile) {
            return searchArray[index];
        }
    }
    return "";
}

export async function verify(hashFile: string, rootHash: string, cloudClient: AccessCloud): Promise<boolean> {

    const searchArray = await cloudClient.searchFile(hashFile, constants.TREEDIR);
    let filename_arr = parseNode(chooseNode(searchArray, hashFile));
    // let filename_arr = ['a', 'b', 'c', 'd', 'e', 'f'];   // Needs to be replaces
    // Retrieve Parent node details
    log("filename: ", filename_arr);
    let tmp;
    let sibling;
    let curr_node = hashFile;
    // TODO fix loop (performance optional)
    while (filename_arr[0] !== "" && filename_arr[0] !== filename_arr[1]) {
        // Call to drive-api : Search
        tmp = parseNode(chooseNode(await cloudClient.searchFile(filename_arr[1], constants.TREEDIR), filename_arr[1]));
        sibling = tmp[3];
        if(tmp[3] !== curr_node && tmp[2] !== curr_node) {
            return false;
        }
        if (tmp[2] != curr_node) {
            sibling = tmp[2];
        }
        curr_node = concat(curr_node, sibling);
        filename_arr = tmp;
        // filename_arr = parseNode(chooseNode(await cloudClient.searchFile(tmp[1], constants.TREEDIR), tmp[1]));
    }
    // compare curr_node with local root
    // curr_node contains computed root hash 
    // Needs to be compared to local copy of rootash

    // True indicates - Not Tampered
    // False indicates - Tampered
    if (curr_node === rootHash)
        return true;
    return false;

}