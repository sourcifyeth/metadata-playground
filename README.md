# Solidity Metadata Playground

🕹️ https://playground.sourcify.dev

This tool allows you to see the [Solidity metadata](https://docs.soliditylang.org/en/latest/metadata.html) hash and other information [encoded at the end](https://docs.soliditylang.org/en/latest/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode) of the smart contract bytecode. Works with any EVM chain listed in [ethereum-lists/chains](https://github.com/ethereum-lists/chains) i.e. https://chainid.network/chains.json.

## Usage

- Choose network and input the contract address to see its deployed bytecode. Some example contracts provided.
  - You can also pass the `address` and/or `chainId` in the query parameters as <https://playground.sourcify.dev/?address=0xb36c99e9a86ff467bbf4312ae852874f7a6fe57d&chainId=69>
- In the popup you will see the contract's deployed bytecode. It will be automatically scrolled to the end where [CBOR encoded data](https://docs.soliditylang.org/en/latest/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode) is appended.
- The CBOR decoding will be highlighted with the sections indicating its length and its contents.
- The CBOR encoded data will be decoded. It will differ for each contract but usually this will contain the Solidity version and the IPFS or Swarm hash.
- It will also try to fetch and display the metadata file from its IPFS hash if available.

## Run

Clone the repository and install dependencies

```
npm install
```

Ethereum Mainnet and Ethereum testnets' connections are provided throught Infura. Copy the `.env-template` file to a file named `.env` and add the Infura key. If left empty, it will use the default [ethers.js Infura key](https://github.com/ethers-io/ethers.js/blob/0d40156fcba5be155aa5def71bcdb95b9c11d889/packages/providers/src.ts/infura-provider.ts#L17)

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

## Docker

To serve the project in a Docker container simply use

```
docker-compose up
```

It will run at http://localhost:2346 as given in the `docker-compose.yaml` file.
