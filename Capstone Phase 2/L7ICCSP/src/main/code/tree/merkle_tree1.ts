import { Tree, Node } from './tree';
import { concat } from '../utils/hashes'

// TODO change the method name of cloud client accordingly
export class MerkleTree implements Tree {
    private childParentMap: { [key: string]: string };
    private hashToNode: { [key: string]: Node };
    private leftChild: { [key: string]: Node };
    private rightChild: { [key: string]: Node };
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
        this.leftChild = {};
        this.rightChild = {};
        this.hashesToRemove = [];
        this.cloudClient = cloudClient;
        this.rootNode = this.getNode(rootHash);
    }
    private getNode(this: MerkleTree, hash: string): Node {
        if (!(hash in this.hashToNode)) {
            const node = {
                hash: hash
            };
            this.hashToNode[hash] = node;
            return node
        }
        return this.hashToNode[hash];
    }
    
    private isNodeComplete(node: Node): boolean {
        if ('realPosition' in node && 'currentPosition' in node) {
            return true;
        }
        return false;
    }
    
    private nodeToHash(this: MerkleTree, node: Node): string {
        const str1 = node.hash;
        const str2 = this.childParentMap[str1] ?? node.hash;
        const str3 = this.leftChild[str1] ?? '0';
        const str4 = this.rightChild[str1] ?? '0';
        const str5 = node.currentPosition?.toString();
        const str6 = node.realPosition?.toString();
        const sep = this.SEP;
        
        return str1 + sep + str2 + sep + str3 + sep + str4 + sep + str5 + sep + str6;
        
    }
    
    private hashesToNode(this: MerkleTree, hashes: string[]): void {
        for (const hash of hashes) {
            const hashArr = hash.split(this.SEP);
            
            const childNode = this.getNode(hashArr[0]);
            if (!this.isNodeComplete(childNode)) {
                childNode.currentPosition = parseInt(hashArr[4]);
                childNode.realPosition = parseInt(hashArr[5]);
                this.hashToNode[hashArr[0]] = childNode;
                
                this.childParentMap[hashArr[0]] = hashArr[1];

                if (hashArr[2].length > 1) {
                    const leftNode = this.getNode(hashArr[2]);
                    leftNode.childPosition = 0;
                    this.leftChild[hashArr[0]] = leftNode;
                }
                if (hashArr[3].length > 2) {
                    const rightNode = this.getNode(hashArr[3]);
                    rightNode.childPosition = 1;
                    this.rightChild[hashArr[0]] = rightNode;
                }
            }
            
        }
    }
    
    private getNodeTreeTop(this: MerkleTree, hash: string): Node {
        // use cloudclient to fetch the hashes
        // Change Function name accordingly
        // const hashes = this.cloudClient.getFilesByReg(hash); 
        let hashes = ["ab,ab,a,b,2,2", "a,ab,0,0,1,1", "b,ab,0,0,1,1"]
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
            // TODO This condition needs to be revisited and verified
            if ((current.currentPosition === current.realPosition && current === this.rootNode) || current.realPosition == 1) {
                return current;
            }
            if (current.currentPosition !== current.realPosition) {
                const leftNode = this.leftChild[current.hash];
                const rightNode = this.rightChild[current.hash];
                if (leftNode) {
                    // hashes = this.cloudClient.getFilesByReg(leftNode.hash);
                    this.hashesToNode(hashes);
                    stack.push(leftNode);
                }
                if (rightNode) {
                    // hashes = this.cloudClient.getFilesByReg(rightNode.hash);
                    this.hashesToNode(hashes);
                    stack.push(rightNode);
                }
            }
        }
        return this.rootNode;
    }
    
    add(this: MerkleTree, fileHash: string): string {
        const newNode  = this.getNode(fileHash);
        newNode.realPosition = this.LEAF;
        // When there is no tree
        if (this.rootNode.hash === "") {
            newNode.currentPosition = this.LEAF;
            this.hashesToAdd.push(this.nodeToHash(newNode));
            return fileHash;
        }
        // if there are nodes
        // get the right node to hash 
        const sibling = this.getNodeTreeTop(this.rootNode.hash);
        // If no sibling found or tree fails 
        if (sibling.hash === "") {
            // TODO replace root node with new node deleting all tree entries or
            // stop add operation
        }
        // modify nodes from bottom to top
        const newParent = this.getNode(concat(sibling.hash, newNode.hash));
        if ('realPosition' in sibling && 'realPosition' in newNode) {
            const max = Number.MAX_SAFE_INTEGER;
            newParent.realPosition = Math.min(sibling.realPosition ?? max, newParent.realPosition ?? max);
            
        }
        return "";
    }
    
    delete(fileHash: string): string {
        throw new Error('Method not implemented.');
    }
    
    update(fileHash: string): string {
        throw new Error('Method not implemented.');
    }
    
    verify(filePath: string): string {
        throw new Error('Method not implemented.');
    }
}