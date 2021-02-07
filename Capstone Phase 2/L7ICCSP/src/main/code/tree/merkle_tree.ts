import { Children } from 'react';
import { Tree, Node } from './tree';

class MerkleTree implements Tree {
    private childParentMap: { [key: string]: string };
    private hashToNode: { [key: string]: Node };
    private hashesToEdit: string[];
    private hashesToRemove: string[];
    private root: Node;
    private LEAF = 1;

    constructor(hashes: string[]) {
        // initialize variables
        this.hashToNode = {};
        this.childParentMap = {};
        this.hashesToEdit = [];
        this.hashesToRemove = [];
        this.root = this.getNode("");
        this.createTree(hashes);
    }

    private createTree(this: MerkleTree, hashes: string[]): void {
        // hash will in the form childHash$parentHash$currentPosition$realPosition
        for (const hash of hashes) {
            const hashArr = hash.split('$');

            const childNode = this.getNode(hashArr[0]);
            childNode.currentPosition = parseInt(hashArr[2]);
            childNode.realPosition = parseInt(hashArr[3]);
            this.hashToNode[hashArr[0]] = childNode;

            this.childParentMap[hashArr[0]] = hashArr[1];

            // check if the current node is root
            if (hashArr[0] === hashArr[1]) {
                this.root = childNode;
            } else {
                const parentNode = this.getNode(hashArr[1]);
                parentNode.children?.push(childNode);
                this.hashToNode[hashArr[1]] = parentNode;
            }
        }
    }

    private getNode(this: MerkleTree, hash: string): Node {
        if (!(hash in this.hashToNode)) {
            return {
                hash: hash
            }
        }
        return this.hashToNode[hash];
    }

    private find(this: MerkleTree): Node {
        const stack = [];
        if (this.root.hash === "") {
            return this.getNode("");
        }
        // search tree for improper node
        let current = this.root;
        while (true) {
            if ("children" in current) {
                
            }
        }

        
        
    }

    add(this: MerkleTree, filePath: string): string {
        // throw new Error('Method not implemented.');
        // TODO call util generateHash util function
        // const hash = gethash(filePath);
        const hash = filePath;

        if (this.root.hash === "") {
            // Create the leaf/root node
            const newNode = this.getNode(hash);
            newNode.currentPosition = this.LEAF;
            newNode.realPosition = this.LEAF;

            // add hash to editList
            this.hashesToEdit.push(hash);
            return hash;
        }
        // find appropriate node hash with the new node

        return "";
    }

    delete(this: MerkleTree, filePath: string): string {
        throw new Error('Method not implemented.');
    }

    update(this: MerkleTree, filePath: string): string {
        throw new Error('Method not implemented.');
    }
}