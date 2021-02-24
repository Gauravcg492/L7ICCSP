import { parseNode } from './nodeParser'
import { concat } from './hashes';
import { AccessCloud } from '../cloud/access_cloud';
import { constants } from './constants';

function chooseNode(SearchArray : any,hashFile : string){
   SearchArray.forEach((element:string) => {
       if (parseNode(element)[0] == hashFile){
           return element;
       }
   });
   return "";
}

export async function verify(hashFile: string, rootHash: string, cloudClient: AccessCloud): Promise<boolean> {

    // TODO : Can be a list or just a string
    let filename_arr = parseNode(chooseNode(await cloudClient.searchFile(hashFile, constants.TREEDIR),hashFile));
    // let filename_arr = ['a', 'b', 'c', 'd', 'e', 'f'];   // Needs to be replaces
    // Retrieve Parent node details
    let tmp;
    let sibling;
    let curr_node = hashFile;

    while (filename_arr[0] != filename_arr[1]) {
        // Call to drive-api : Search
        tmp = parseNode((await cloudClient.searchFile(filename_arr[1], constants.TREEDIR))[0]);
        sibling = tmp[3];
        if (tmp[2] != hashFile) {
            sibling = tmp[2];
        }
        curr_node = concat(curr_node, sibling);
        filename_arr = parseNode((await cloudClient.searchFile(tmp[1], constants.TREEDIR))[0]);
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