// Interface for accessing storage to fetch the root hash
export interface ConfigInput {
    id: string; // Email id or unique representation to identify the user
    configPath: string; // Name of the config file
}
export interface HashInput {
    hash: string; // Root hash of the Merkle tree
}
export interface AccessStorage {
    // Function which fetches root hash
    getRootHash(obj: ConfigInput): string;
    // Function which appends root hash
    putRootHash(obj: ConfigInput & HashInput): void;
}