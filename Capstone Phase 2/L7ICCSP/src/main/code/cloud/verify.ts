
import {parseNode} from '../utils/nodeParser'
import { sha256 , concat} from '../utils/hashes';

export function verify(filename : string,hash_file : string){
    var filename_arr = parseNode(filename);
    // Retrieve Parent node details
    var tmp;
    var sibling;
    var curr_node = hash_file;
    var tmp_hash;
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
}