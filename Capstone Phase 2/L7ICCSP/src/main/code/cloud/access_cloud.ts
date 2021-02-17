// interface for accessing files and uploading files
export interface AccessCloud{
    // change parameters and refine return types as we get clarity
    getDirList(): string[];     // list files api
    getFile(downLoc:string): any;     // download api
    putFile(): void;    // Upload api
}