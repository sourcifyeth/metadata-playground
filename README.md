# Solidity Metadata Playground

🕹️ https://playground.sourcify.dev

This tool allows you to see the [Solidity metadata](https://docs.soliditylang.org/en/latest/metadata.html) hash and other information [encoded at the end](https://docs.soliditylang.org/en/latest/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode) of the smart contract bytecode. Works with any EVM chain listed in [ethereum-lists/chains](https://github.com/ethereum-lists/chains) i.e. https://chainid.network/chains.json.

## Usage

### With Query Parameters

Either with `chainId` and `address`

[`https://playground.sourcify.dev/?address=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&chainId=1`](https://playground.sourcify.dev/?address=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&chainId=1)

Or directly with `bytecode`

[`https://playground.sourcify.dev/?bytecode=0x7f7050c9e0f4ca769c69bd3a8ef7...`](https://playground.sourcify.dev/?bytecode=0x7f7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c35556fe43616e6e6f742063616c6c2066616c6c6261636b2066756e6374696f6e2066726f6d207468652070726f78792061646d696e43616e6e6f74206368616e6765207468652061646d696e206f6620612070726f787920746f20746865207a65726f206164647265737343616e6e6f742073657420612070726f787920696d706c656d656e746174696f6e20746f2061206e6f6e2d636f6e74726163742061646472657373a2646970667358221220119e941d353783c92238fbc4e38a3a0327e471d10cff47c0a5066819d4a4195664736f6c634300060c0033)

### Through the UI

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
