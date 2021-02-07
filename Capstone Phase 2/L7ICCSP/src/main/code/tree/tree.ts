import { type } from "os";

export interface Tree {
    // Returns Updated RootHash
    add(filePath: string): string;
    delete(filePath: string): string;
    update(filePath: string): string;
}

export type Node = {
    hash: string;
    currentPosition?: Number;
    realPosition?: Number;
    children?: [Node, Node];
}