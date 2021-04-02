// interface for accessing files and uploading files
export interface AccessCloud {
    // change parameters and refine return types as we get clarity
    getFileId(filename: string): string;
    getDirList(dir: string): Promise<string[]>;     // List Files api
    getFile(dir: string, fileId: string): Promise<string>;     // Download api
    putFile(filePath: string, dir: string): Promise<boolean>;    // Upload api
    renameFile(oldFileName: string, newFileName: string): Promise<boolean>;      // Rename File api
    searchFile(filePrefix: string, dir: string): Promise<string[]>;  // Search File api
    putFolder(folderName: string, dir: string): Promise<boolean>; // Create Folder api
    deleteFile(fileId: string): Promise<boolean>; // Delete File api
}