// interface for accessing files and uploading files
export interface AccessCloud{
    // change parameters and refine return types as we get clarity
    getDirList(dir: string): Promise<string[]>;     // list files api
    getFile(dir: string, filename: string, callback: Function): Promise<void>;     // download api
    putFile(filePath: string, dir: string): void;    // Upload api
    renameFile(oldFileName: string, newFileName: string):void;      // Rename File
    searchFile(filePrefix: string, dir: string): Promise<string[]>;  // Search File
    putFolder(folderName: string, dir: string): void;
}