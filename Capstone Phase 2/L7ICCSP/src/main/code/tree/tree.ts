export interface Tree {
    // Returns Updated RootHash
    add(filePath: string): string;
    delete(filePath: string): string;
    update(filePath: string): string;
    verify(filePath: string): string;
}

export type Node = {
    hash: string;
    currentPosition?: number;
    realPosition?: number;
    childPosition?: number;
}