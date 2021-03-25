// interface for accessing files and uploading files
export interface AccessCloud {
    // change parameters and refine return types as we get clarity
    getFileId(filename: string): string;
    getDirList(dir: string): Promise<string[]>;     // list files api
    getFile(dir: string, fileId: string): Promise<string>;     // download api
    putFile(filePath: string, dir: string): Promise<boolean>;    // Upload api
    renameFile(oldFileName: string, newFileName: string): Promise<boolean>;      // Rename File
    searchFile(filePrefix: string, dir: string): Promise<string[]>;  // Search File
    putFolder(folderName: string, dir: string): Promise<boolean>;
}