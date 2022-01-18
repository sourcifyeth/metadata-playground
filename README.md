# Solidity Metadata Playground

This tool allows you to see the [Solidity metadata](https://docs.soliditylang.org/en/latest/metadata.html) hash and other information [encoded at the end](https://docs.soliditylang.org/en/latest/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode) of the smart contract bytecode. Works with any EVM chain listed in [ethereum-lists/chains](https://github.com/ethereum-lists/chains) i.e. https://chainid.network/chains.json.

## Usage

- Choose network and input the contract address to see its deployed bytecode. Some example contracts provided.
- In the popup you will see the contract's deployed bytecode. It will be automatically scrolled to the end where [CBOR encoded data](https://docs.soliditylang.org/en/latest/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode) is appended.
- The CBOR decoding will be highlighted with the sections indicating its length and its contents.
- The CBOR encoded data will be decoded. It will differ for each contract but usually this will contain the Solidity version and the IPFS or Swarm hash.
- It will also try to fetch and display the metadata file from its IPFS hash if available.

## Run

Clone the repository and install dependencies

```
npm install
```

Ethereum Mainnet and Ethereum testnets' connections are provided throught Infura. Copy the `.env-template` file to a file named `.env` and add the Infura key.

```
REACT_APP_INFURA_KEY=<Your-Key>
```

Run the deployment server with

```
npm start
```

## Build

Build the project with

```
npm run build
```
