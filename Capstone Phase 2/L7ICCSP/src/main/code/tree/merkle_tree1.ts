import { Tree, Node } from './tree';
import { concat } from '../utils/hashes'
import { parseNode } from '../utils/nodeParser'

// TODO change the method name of cloud client accordingly
export class MerkleTree implements Tree {
    private childParentMap: { [key: string]: string };
    private hashToNode: { [key: string]: Node };
    private leftChild: { [key: string]: Node };
    private rightChild: { [key: string]: Node };
    private hashesToAdd: Node[];
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
                stack.length = 0;
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

    private getOtherChild(parent: Node, child: Node): Node {
        if (child.childPosition) {
            return this.rightChild[parent.hash];
        } else {
            return this.leftChild[parent.hash];
        }
    }

    private updateChildInfo(parent: Node, child: Node): void {
        if (child.childPosition) {
            child.childPosition = 0;
            this.leftChild[parent.hash] = child;
        } else {
            this.rightChild[parent.hash] = child;
        }
    }

    private clearOldHashInfo(hash: string): void {
        delete this.leftChild[hash];
        delete this.rightChild[hash];
    }

    private shiftHashToNode(oldHash: string, newHash: string): void {
        this.hashToNode[newHash] = this.hashToNode[oldHash];
        delete this.hashToNode[oldHash];
    }

    addToTree(this: MerkleTree, fileHash: string): string {
        const newNode = this.getNode(fileHash);
        this.hashesToAdd.push(newNode);
        newNode.realPosition = this.LEAF;

        // When there is no tree
        if (this.rootNode.hash === "") {
            newNode.currentPosition = this.LEAF;
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
        // get the old hash string of sibling to replace
        let siblingHash = this.nodeToHash(sibling);
        this.hashesToEdit[siblingHash] = sibling;

        // Create new Parent (this parent becomes child of sibling's parent)
        const newParent = this.getNode(concat(sibling.hash, newNode.hash));
        this.hashesToAdd.push(newParent);
        // Add the new parent in place of sibling
        if ('realPosition' in sibling) {
            // Update only real position of parent and update sibling and child's current pos
            const max = Number.MAX_SAFE_INTEGER;
            newParent.realPosition = Math.min(sibling.realPosition ?? max, newNode.realPosition ?? max) + 1;
            if (sibling.currentPosition && sibling.currentPosition != sibling.realPosition) {
                sibling.currentPosition -= 1;
            }
            newNode.currentPosition = sibling.currentPosition;

            // Set relative positions of sibling and newnode with respect to new parent
            sibling.childPosition = sibling.childPosition ?? 0;
            newNode.childPosition = sibling.childPosition ^ 1;
            // Define relation between all three nodes
            this.updateChildInfo(newParent, sibling);
            this.updateChildInfo(newParent, newNode);

            // parent will take sibling relative position w.r.t to it's old parent
            newParent.childPosition = sibling.childPosition;
            // Fetch sibling's old parent
            const siblingParent = this.getNode(this.childParentMap[sibling.hash]);

            // Now sibling's parent can be modified to new parent along with new node
            this.childParentMap[newNode.hash] = newParent.hash;
            this.childParentMap[sibling.hash] = newParent.hash;

            // If sibling's parent exists keep updating the parents (first parent is outside the loop
            // because its the only parent whose child is being replaced, rest only values change
            if (siblingParent) {
                
                // create loop which would propogate as it updates
                let parent = siblingParent;
                let child1 = newParent;
                // parent of root is root
                while (parent.hash != child1.hash) {
                    // fetch parent's other sibling (if parent exists, then it will always have two children)
                    let child2 = this.getOtherChild(parent, child1);
                    
                    // sibling's old parent's child info will change
                    this.hashesToEdit[this.nodeToHash(parent)] = parent;
                    // hash of parent will change so clear old hash garbage
                    this.clearOldHashInfo(parent.hash);
                    const oldHash = parent.hash;

                    parent.hash = concat(child1.hash, child2.hash);
                    // update hash to node relation so that new parent hash can map to it's node
                    this.shiftHashToNode(oldHash, parent.hash);
                    // update child1's current position from its sibling i.e., child 2
                    child1.currentPosition = child2.currentPosition;
                    // Once parent's hash is updated update the new hashes child info
                    this.updateChildInfo(parent, child1);
                    this.updateChildInfo(parent, child2);
                    // traverse up
                    child1 = parent;
                    parent = this.getNode(this.childParentMap[parent.hash]);
                }
                return child1.hash;
            } else {
                // no parent so new parent becomes root
                this.childParentMap[newParent.hash] = newParent.hash;
                newParent.currentPosition = Math.max(sibling.currentPosition ?? 1, newNode.currentPosition ?? 1);
                return newParent.hash
            }
        }

        return "";
    }

    deleteFromTree(fileHash: string): string {
        // hashes = prefixsearch(fileHash) TODO
        const hashes:string[] = []
        // Filehash node would have been created
        this.hashesToNode(hashes);
        const deleteNode = this.getNode(fileHash);
        // Retrieve the parent to check if its present
        let parent = this.childParentMap[deleteNode.hash];
        if(parent) {
            // TODO delete
        } else {
            // Assume file deleted or tampered and just return root
            // TODO In download compare old and new root hash, if same throw error saying file tampered or
            // metadata of file doesn't exist
            
        }
        return "";
    }

    updateToTree(fileHash: string): string {
        throw new Error('Method not implemented.');
    }

}