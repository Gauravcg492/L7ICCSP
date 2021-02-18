export interface Tree {
    // Returns Updated RootHash
    addToTree(fileHash: string): string;
    deleteFromTree(fileHash: string): string;
    updateToTree(fileHash: string): string;
}

export type Node = {
    hash: string;
    currentPosition?: number;
    realPosition?: number;
    childPosition?: number;
}