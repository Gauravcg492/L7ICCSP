
import {parseNode} from '../utils/nodeParser'
import { sha256 , concat} from '../utils/hashes';

// Needs to be implemented
function search(temp : string){         // Needs to be removed - Temp fix
    return "Temp string";
}

export function verify(hash_file : string,local_root_hash : string){

    // TODO : Can be a list or just a string
    // let filename_arr = parseNode(search(hash_file));
    let filename_arr = ['a','b','c','d','e','f'];   // Needs to be replaces
    // Retrieve Parent node details
    let tmp;
    let sibling;
    let curr_node = hash_file;
    
    while (filename_arr[0] != filename_arr[1]){
        // Call to drive-api : Search
        tmp = parseNode(search(filename_arr[1]));
        sibling = tmp[3];
        if (tmp[2] != hash_file){
            sibling = tmp[2];
        }
        curr_node = concat(curr_node,sibling);
        filename_arr = parseNode(search(tmp[1]));
    }
    // compare curr_node with local root
    // curr_node contains computed root hash 
    // Needs to be compared to local copy of rootash

    // True indicates - Not Tampered
    // False indicates - Tampered
    if (curr_node === local_root_hash)
        return true;
    return false;
    
}