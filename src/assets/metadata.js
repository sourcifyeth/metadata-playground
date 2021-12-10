const metadataStr = `{
  "compiler": { "version": "0.8.4+commit.c7e474f2" },
  "language": "Solidity",
  "output": {
    // Application Binary Interface (ABI) describing how to interact with the contract,
    // and what functions and parameters are available.
    "abi": [
      {
        "inputs": [],
        "name": "retrieve",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "num", "type": "uint256" }
        ],
        "name": "store",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    // Developer documentation of each function (if available)
    "devdoc": {
      "details": "Store & retrieve value in a variable",
      "kind": "dev",
      "methods": {
        "retrieve()": {
          "details": "Return value ",
          "returns": { "_0": "value of 'number'" }
        },
        "store(uint256)": {
          "details": "Store value in variable",
          "params": { "num": "value to store" }
        }
      },
      "title": "Storage",
      "version": 1
    },
    // User documentation of each function (if available)
    "userdoc": { "kind": "user", "methods": {}, "version": 1 }
  },
  // Compilation settings to allow re-compilation
  "settings": {
    "compilationTarget": { "contracts/1_Storage.sol": "Storage" },
    "evmVersion": "istanbul",
    "libraries": {},
    "metadata": { "bytecodeHash": "ipfs" },
    "optimizer": { "enabled": false, "runs": 200 },
    "remappings": []
  },
  // Source files used 
  "sources": {
    "contracts/1_Storage.sol": {
      // keccak256 hash of the source file at the time of compilation
      "keccak256": "0xb6ee9d528b336942dd70d3b41e2811be10a473776352009fd73f85604f5ed206",
      "license": "GPL-3.0",
      // IPFS and Swarm hashes of the file
      // Calculated deterministically and allows download if published
      "urls": [
        "bzz-raw://fe52c6e3c04ba5d83ede6cc1a43c45fa43caa435b207f64707afb17d3af1bcf1",
        "dweb:/ipfs/QmawU3NM1WNWkBauRudYCiFvuFE1tTLHB98akyBvb9UWwA"
      ]
    }
  },
  "version": 1
}`;

export default metadataStr;
