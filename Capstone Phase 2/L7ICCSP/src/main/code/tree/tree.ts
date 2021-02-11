import { type } from "os";

export interface Tree {
    // Returns Updated RootHash
    add(fileHash: string): string;
    delete(fileHash: string): string;
    update(fileHash: string): string;
}

export type Node = {
    hash: string;
    currentPosition?: Number;
    realPosition?: Number;
    children?: [Node, Node];
}