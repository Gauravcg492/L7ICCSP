export interface Tree {
    // Returns Updated RootHash
    addToTree(fileHash: string): Promise<string>;
    deleteFromTree(fileHash: string): Promise<string>;
    updateToTree(fileHash: string): Promise<string>;
    updateMerkle(): Promise<boolean>;
}

export type Node = {
    hash: string;
    currentPosition?: number;
    realPosition?: number;
    childPosition?: number;
}