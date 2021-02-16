
export function parseNode(filename : String){
    // General Structure Of a file name
    // Filename : node_hash,parent_node_hash,left_child_hash,right_child_hash,position_1,position_2
    // return as an array
    var str = filename; 
    var splitted = str.split(",", 6); 
    console.log(splitted);
}
