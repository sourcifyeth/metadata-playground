import blockscoutLogo from "../assets/blockscout.png";
import etherscanLogo from "../assets/etherscan.webp";
const BlockExplorerButton = ({ chain, address, sourcifyChains }) => {
  const sourcifyChainObject = sourcifyChains.find((sourcifyChain) => sourcifyChain.chainId === chain);
  // Filter chains that include an 'etherscanAPI' and transform their URLs to exclude the api part in https://api.etherscan.io/api
  let etherscanURL;

  if (sourcifyChainObject?.etherscanAPI) {
    const url = new URL(sourcifyChainObject.etherscanAPI);
    const subdomains = url.hostname.split("."); // Split the hostname into parts
    const cleanedHostname = subdomains.slice(1).join("."); // Join parts back without the first subdomain
    etherscanURL = `https://${cleanedHostname}`; // Prepend 'https://' to the cleaned hostname, ignoring any paths
  }

  console.log(etherscanURL);

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
  if (etherscanURL) {
    return (
      <Button>
        <img src={etherscanLogo} width={16} className="mr-1" alt="etherscan logo" />
        <a
          href={`${etherscanURL}/address/${address}#code`}
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
        <img src={blockscoutLogo} width={16} className="mr-1" alt="blockscout logo" />
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
