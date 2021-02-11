import { sep } from 'path';
import { Tree, Node } from './tree';

export class MerkleTree implements Tree {
    private childParentMap: { [key: string]: string };
    private hashToNode: { [key: string]: Node };
    private hashesToAdd: string[];
    private hashesToEdit: { [key: string]: Node };
    private hashesToRemove: string[];
    private rootNode: Node;

    // cloud access api
    private cloudClient: any;

    // Separator
    private SEP = ',';
    private LEAF = 1;

    constructor(rootHash: string, cloudClient: any) {
        this.childParentMap = {};
        this.hashToNode = {};
        this.hashesToAdd = [];
        this.hashesToEdit = {};
        this.hashesToRemove = [];
        this.cloudClient = cloudClient;
        this.rootNode = this.getNode(rootHash);
    }
    private getNode(this: MerkleTree, hash: string): Node {
        if (!(hash in this.hashToNode)) {
            return {
                hash: hash
            }
        }
        return this.hashToNode[hash];
    }

    private nodeToHash(this: MerkleTree, node: Node): string {
        const str1 = node.hash;
        const str2 = this.childParentMap[str1];
        const str3 = node.currentPosition?.toString();
        const str4 = node.realPosition?.toString();
        const sep = this.SEP;

        return str1 + sep + str2 + sep + str3 + sep + str4;

    }

    private getNodeTree(this: MerkleTree): Node {
        // use cloudclient to fetch the hashes
        return this.getNode("");
    }

    add(this: MerkleTree, fileHash: string): string {
        // When there is no tree
        if (this.rootNode.hash == "") {
            this.rootNode.hash = fileHash;
            this.rootNode.realPosition = this.LEAF;
            this.rootNode.currentPosition = this.LEAF;
            this.hashesToAdd.push(this.nodeToHash(this.rootNode));
            this.hashToNode[fileHash] = this.rootNode; 
            return fileHash;
        }
        // if there are nodes
        // get the right node to hash 

        return "";
    }

    delete(fileHash: string): string {
        throw new Error('Method not implemented.');
    }

    update(fileHash: string): string {
        throw new Error('Method not implemented.');
    }

}