export interface Tree {
    // Returns Updated RootHash
    addToTree(filePath: string): string;
    deleteFromTree(filePath: string): string;
    updateToTree(filePath: string): string;
}

export type Node = {
    hash: string;
    currentPosition?: number;
    realPosition?: number;
    childPosition?: number;
}