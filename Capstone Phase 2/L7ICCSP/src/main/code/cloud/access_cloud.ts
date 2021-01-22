// interface for accessing files and uploading files
interface AccessCloud{
    // change parameters and refine return types as we get clarity
    getDirList(): string[];
    getFile(): any;
    putFile(): void;
}