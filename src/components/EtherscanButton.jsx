import logo from "../assets/etherscan.webp";

const EtherscanButton = ({ chain, address }) => {
  const chainSubdomains = {
    1: "",
    3: "ropsten.",
    4: "rinkeby.",
    5: "goerli.",
  };

  return (
    <button class="flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-default disabled:opacity-50 disabled:text-gray-500">
      <img src={logo} width={16} className="mr-1" />
      <a
        href={`https://${
          chainSubdomains[chain] || ""
        }etherscan.io/address/${address}#code`}
        target="_blank"
        // style={{ lineHeight: 0 }}
      >
        View on Etherscan
      </a>
    </button>
  );
};

export default EtherscanButton;
