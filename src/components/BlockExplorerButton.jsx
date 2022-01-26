import blockscoutLogo from "../assets/blockscout.png";
import etherscanLogo from "../assets/etherscan.webp";
const BlockExplorerButton = ({ chain, address }) => {
  const etherscanChains = {
    1: "etherscan.io",
    3: "ropsten.etherscan.io",
    4: "rinkeby.etherscan.io",
    5: "goerli.etherscan.io",
    10: "optimistic.etherscan.io",
    56: "bscscan.com",
    97: "testnet.bscscan.com",
    69: "kovan-optimistic.etherscan.io",
    137: "polygonscan.com",
    80001: "mumbai.polygonscan.com",
  };

  const blockscoutDomains = {
    100: "xdai/mainnet",
    77: "poa/core",
  };
  const Button = (props) => (
    <button
      className="flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-default disabled:opacity-50 disabled:text-gray-500"
      {...props}
    ></button>
  );
  // Etherscan
  if (Object.keys(etherscanChains).includes(chain.toString())) {
    return (
      <Button>
        <img
          src={etherscanLogo}
          width={16}
          className="mr-1"
          alt="etherscan logo"
        />
        <a
          href={`https://${
            etherscanChains[chain] || ""
          }/address/${address}#code`}
          target="_blank"
          rel="noreferrer"
          // style={{ lineHeight: 0 }}
        >
          View on Etherscan
        </a>
      </Button>
    );
  }
  // Blockscout
  else if (Object.keys(blockscoutDomains).includes(chain.toString())) {
    return (
      <Button>
        <img
          src={blockscoutLogo}
          width={16}
          className="mr-1"
          alt="blockscout logo"
        />
        <a
          href={`https://blockscout.com/${blockscoutDomains[chain]}/address/${address}/contracts`}
          target="_blank"
          rel="noreferrer"
          // style={{ lineHeight: 0 }}
        >
          View on Blockscout
        </a>
      </Button>
    );
  } else {
    return <Button>No known block explorer</Button>;
  }
};

export default BlockExplorerButton;
