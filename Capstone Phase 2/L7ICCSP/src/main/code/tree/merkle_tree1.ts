import { sep } from 'path';
import { Tree, Node } from './tree';

enum Complete {
    NO = 1,
    HALF,
    FULL,
}

export class MerkleTree implements Tree {
    private childParentMap: { [key: string]: string };
    private hashToNode: { [key: string]: Node };
    private hashesToAdd: string[];
    private hashesToEdit: { [key: string]: Node };
    private hashesToRemove: string[];
    private rootNode: Node;

    // cloud access api
    private cloudClient: any;

    // CONSTANTS
    private SEP = ','; // separator
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

    private isNodeComplete(node: Node) {
        if ('realPosition' in node && 'currentPosition' in node) {
            if ('children' in node) {
                if (node.children?.length === 2) {
                    return Complete.FULL;
                }
            }
            return Complete.HALF;
        }
        return Complete.NO;
    }

    private nodeToHash(this: MerkleTree, node: Node): string {
        const str1 = node.hash;
        const str2 = this.childParentMap[str1] ?? node.hash;
        const str3 = node.currentPosition?.toString();
        const str4 = node.realPosition?.toString();
        const sep = this.SEP;

        return str1 + sep + str2 + sep + str3 + sep + str4;

    }

    private hashesToNode(this: MerkleTree, hashes: string[]): void {
        for (const hash of hashes) {
            const hashArr = hash.split(this.SEP);

            const childNode = this.getNode(hashArr[0]);
            if (this.isNodeComplete(childNode) === Complete.NO) {
                childNode.currentPosition = parseInt(hashArr[2]);
                childNode.realPosition = parseInt(hashArr[3]);
                this.hashToNode[hashArr[0]] = childNode;

                this.childParentMap[hashArr[0]] = hashArr[1];
            }

            // check if the current node is root
            if (hashArr[0] !== hashArr[1]) {
                const parentNode = this.getNode(hashArr[1]);
                if (this.isNodeComplete(parentNode) !== Complete.FULL) {
                    parentNode.children?.push(childNode);
                    this.hashToNode[hashArr[1]] = parentNode;
                }
            }
        }
    }

    private getNodeTreeTop(this: MerkleTree, hash: string): Node {
        // use cloudclient to fetch the hashes
        // Change Function name accordingly
        // const hashes = this.cloudClient.getFilesByReg(hash); 
        let hashes = ["ab,ab,2,2", "a,ab,1,1", "b,ab,1,1"]
        // No root hash found in server (create new one)
        if (hashes.length === 0) {
            return this.getNode("");
        }
        // convert the initial hashes 
        this.hashesToNode(hashes);
        // find improper nodes, if not improper fetch more hashes until we reach leaf
        const stack: Node[] = [];
        stack.push(this.rootNode);
        while (stack.length > 0) {
            const current = stack.pop() ?? this.getNode("");
            if ((current.currentPosition === current.realPosition && current === this.rootNode) || current.realPosition == 1) {
                return current;
            }
            if (!("children" in current)) {
                // hashes = this.cloudClient.getFilesByReg(current.hash)
                this.hashesToNode(hashes);
            }
            for (let child of current.children ?? []) {
                stack.push(child);
            }
        }
        return this.getNode("");
    }

    add(this: MerkleTree, fileHash: string): string {
        // When there is no tree
        if (this.rootNode.hash === "") {
            this.rootNode.hash = fileHash;
            this.rootNode.realPosition = this.LEAF;
            this.rootNode.currentPosition = this.LEAF;
            this.hashesToAdd.push(this.nodeToHash(this.rootNode));
            this.hashToNode[fileHash] = this.rootNode;
            return fileHash;
        }
        // if there are nodes
        // get the right node to hash 
        const sibling = this.getNodeTreeTop(this.rootNode.hash);
        // If no sibling found or tree fails 
        if (sibling.hash === "") {
            // TODO replace root node with new node delting all tree entries or
            // stop add operation
        } 
        // modify nodes from bottom to top
        let current = sibling
        
        return "";
    }

    delete(fileHash: string): string {
        throw new Error('Method not implemented.');
    }

    update(fileHash: string): string {
        throw new Error('Method not implemented.');
    }

}