import ContractCallDecoder from "@ethereum-sourcify/contract-call-decoder";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";
import nonrandomContracts from "./assets/nonrandomContracts";
import Connecting from "./components/Connecting";
import CustomSelectSearch from "./components/CustomSelectSearch/CustomSelectSearch";
import Header from "./components/Header";
import Modal from "./components/Modal";
// import RandomContract from "./components/RandomContract";
// import RandomContractInfo from "./components/RandomContractInfo";
import Explainer from "./Explainer";

const ScrollArrow = () => {
  const [scrollHidden, setScrollHidden] = useState(false);
  const handleScroll = () => {
    if (window.pageYOffset > 200) {
      setScrollHidden(true);
      document.removeEventListener("scroll", handleScroll);
    }
  };
  document.addEventListener("scroll", handleScroll);

  return (
    <div id="scrollArrow">
      <svg className="arrows" hidden={scrollHidden}>
        <path className="a1" d="M0 0 L30 32 L60 0"></path>
        <path className="a2" d="M0 20 L30 52 L60 20"></path>
        <path className="a3" d="M0 40 L30 72 L60 40"></path>
      </svg>
    </div>
  );
};
function App() {
  const [byteCode, setByteCode] = useState();
  const [decodedCbor, setDecodedCbor] = useState();
  const [metadataHash, setMetadataHash] = useState();
  const [provider, setProvider] = useState();
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [chainIndex, setChainIndex] = useState(0);
  const [chainObject, setChainObject] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [customByteCode, setCustomByteCode] = useState();
  const [chainArray, setChainArray] = useState(); // chainId.network/chains.json result
  const [connected, setConnected] = useState("not connected");

  // On Mount
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const paramAddress = urlParams.get("address");
    const paramChainId = parseInt(urlParams.get("chainId"));
    fetch("https://chainid.network/chains.json")
      .then((res) => res.json())
      .then((json) => {
        setChainArray(json);
        setChainObject(json[0]);
        setChainIndex(0);
        if (paramAddress && paramChainId) {
          setAddress(paramAddress);
          const chainIndex = json.findIndex(
            (chainObj) => chainObj.chainId === paramChainId
          );
          setChainIndex(chainIndex);
        }
      })
      .catch(() => alert("Couldn't fetch networks"));
  }, []);

  // On chainIndex change
  useEffect(() => {
    if (!chainArray) return;
    setErrorMessage();
    setConnected("connecting");
    const chainlistObject = chainArray[chainIndex];

    // Decide provider URL
    let provider;
    // Ethereum networks
    if ([1, 3, 4, 5, 42].includes(chainlistObject.chainId)) {
      provider = new ethers.providers.InfuraProvider(
        chainlistObject.chainId,
        process.env.REACT_APP_INFURA_KEY
      );
    }
    // Arbitrum One
    else if (chainlistObject.chainId === 42161) {
      provider = new ethers.providers.JsonRpcProvider(
        "https://arbitrum-mainnet.infura.io/v3/" +
          process.env.REACT_APP_INFURA_KEY,
        { ensAddress: chainlistObject?.ens?.registry }
      );
    } else {
      try {
        provider = new ethers.providers.JsonRpcProvider(chainlistObject.rpc[0]);
      } catch (err) {
        console.error(err);
      }
    }
    setProvider(provider);
    provider
      .getNetwork()
      .then((data) => {
        setConnected("connected");
      })
      .catch((err) => {
        chainlistObject.rpc[0]
          ? setErrorMessage(
              "Can't connect to the network at " + chainlistObject.rpc[0]
            )
          : setErrorMessage("Can't connect to the network: No RPC found");

        setConnected("not connected");
      });
  }, [chainIndex, chainArray]);

  const chainIdToIndex = (id) => {
    const chainIndex = chainArray.findIndex(
      (chainObj) => chainObj.chainId === id
    );
    return chainIndex;
  };

  const handleAddressChange = (e) => {
    e.preventDefault();
    setErrorMessage();
    setAddress(e.target.value);
  };

  const handleCustomBytecodeChange = (e) => {
    e.preventDefault();
    setErrorMessage();
    const input = e.target.value;
    const formattedBytecode = input.startsWith("0x")
      ? input.trim()
      : "0x" + input.trim();
    setCustomByteCode(formattedBytecode);
  };

  const decodeBytecodeCbor = (byteCode) => {
    let decodedCbor;
    console.log("decoding bytecode: " + byteCode.slice(0, 50));
    const formattedBytecode = byteCode.startsWith("0x")
      ? byteCode.trim()
      : "0x" + byteCode.trim();
    try {
      decodedCbor = ContractCallDecoder.decodeCborAtTheEnd(formattedBytecode);
    } catch (err) {
      console.error(err);
      if (err.message.startsWith("Unexpected data")) {
        setErrorMessage("Unable to decode bytecode with CBOR");
      } else {
        setErrorMessage(err.message);
      }
      return null;
    }
    if (decodedCbor) {
      setModalOpen(true);
      const stringifyBuffers = {}; // show buffers in hex
      Object.keys(decodedCbor).forEach((key) => {
        stringifyBuffers[key] =
          typeof decodedCbor[key] === "boolean"
            ? decodedCbor[key]
            : "0x" + decodedCbor[key].toString("hex");
      });
      setDecodedCbor(stringifyBuffers);
      try {
        const metadataHash =
          ContractCallDecoder.getHashFromDecodedCbor(decodedCbor);
        setMetadataHash(metadataHash);
      } catch (err) {
        setMetadataHash(null);
      }
    } else {
      setDecodedCbor(null);
      setMetadataHash(null);
    }
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setErrorMessage();
    let code;
    try {
      code = await provider.getCode(address);
    } catch (err) {
      if (err) {
        return setErrorMessage(err.message);
      }
    }
    if (code === "0x") {
      return setErrorMessage("No contract found at the address");
    }
    setByteCode(code);
    decodeBytecodeCbor(code);
  };

  const handleDecodeCustomByteCode = (e) => {
    e.preventDefault();
    console.log("Decoding custom");
    setAddress("");
    setByteCode(customByteCode);
    decodeBytecodeCbor(customByteCode);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setMetadataHash(null);
    setDecodedCbor(null);
    setByteCode(null);
  };
  if (!chainArray) {
    return "Loading";
  }
  return (
    <div className="App  break-words">
      <Header />
      <ScrollArrow />
      <div className="mx-4 md:mx-48 lg:mx-64 decoration-2">
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          byteCode={byteCode}
          decodedCbor={decodedCbor}
          metadataHash={metadataHash}
          address={address}
          chainObject={chainObject}
        />
        <div className="flex flex-col items-center">
          <img
            className="w-12 md:w-16"
            src={process.env.PUBLIC_URL + "/solidity.png"}
            alt="Solidity logo"
          />

          <h1 className="mt-2 text-2xl md:text-5xl font-medium vt323 text-center">
            Solidity metadata.json playground
          </h1>
          <div className="mt-4">
            {chainArray ? (
              <div>
                <Connecting connected={connected} />
                <CustomSelectSearch
                  options={chainArray.map((chain, i) => ({
                    name: `#${chain.chainId} ${chain.name}`,
                    value: i,
                  }))}
                  value={chainIndex}
                  onChange={(index) => setChainIndex(index)}
                />
                <div className="text-xs text-gray-600 text-center mt-1">
                  Network list from{" "}
                  <a
                    className="underline hover:text-gray-900"
                    href="https://github.com/ethereum-lists/chains"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ethereum-lists/chains
                  </a>
                </div>
                {/* <div className="text-xs text-gray-600 text-center mt-1">
                  Random contracts from{" "}
                  <a
                    className="underline hover:text-gray-900"
                    href="https://github.com/ethereum-lists/contracts"
                    target="_blank"
                  >
                    ethereum-lists/contracts
                  </a>
                </div> */}
              </div>
            ) : (
              <div> Loading chain list </div>
            )}
          </div>
          <div className="text-red-800 text-sm text-center">{errorMessage}</div>
        </div>
        <div>
          <form noValidate onSubmit={handleSubmitAddress} key="form">
            <div className="mt-2 text-gray-700">
              {/* <RandomContractInfo
                chainId={chainObject?.chainId}
                address={address}
              /> */}
              <div className="flex justify-between">
                <div className="text-sm md:text-base flex items-end">
                  Enter Contract Address or ENS
                </div>
                {/* <RandomContract
                  handleChainAndContractChange={handleChainAndContractChange}
                /> */}
              </div>

              <div className="">
                <input
                  type="text"
                  id="input-address"
                  className=" rounded-lg border-transparent flex-1 appearance-none border border-ceruleanBlue-40 w-full py-2 px-4 bg-ceruleanBlue-10 text-ceruleanBlue-130 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-ceruleanBlue-100 focus:border-transparent"
                  name="address"
                  placeholder="0x34a...456d"
                  value={address}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="w-full flex flex-col items-center">
                <button
                  type="submit"
                  className="mt-1 py-2 px-4 w-full bg-ceruleanBlue-100 hover:bg-ceruleanBlue-130 focus:ring-ceruleanBlue-70 focus:ring-offset-ceruleanBlue-10 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg disabled:opacity-50 disabled:cursor-default"
                  disabled={!(connected === "connected")}
                >
                  Decode
                </button>
              </div>
              <div className="mt-2 text-center">
                {" "}
                <div className="mt-4">
                  Click to decode some example contracts:
                </div>
                <div className="flex flex-wrap justify-center items-center">
                  {/* <ul> */}
                  {nonrandomContracts.map((contract, i) => (
                    <button
                      onClick={() => {
                        setAddress(contract.address);
                        const index = chainIdToIndex(contract.chainId);
                        setChainIndex(index);
                      }}
                      key={`exampleContract-${i}`}
                      className="mx-1 py-2 px-4 my-1 bg-ceruleanBlue-10 hover:bg-ceruleanBlue-100 hover:text-white text-ceruleanBlue-100 transition ease-in duration-100 text-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                    >
                      {contract.name}
                      <div className="text-xs text-gray-500">
                        {contract.info}
                      </div>
                    </button>
                  ))}
                  {/* </ul> */}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div>
          <form noValidate onSubmit={handleDecodeCustomByteCode} key="form">
            <div className="text-sm md:text-base text-gray-700">
              <div className="mt-2">or paste contract bytecode</div>

              <div className="">
                <textarea
                  type="text"
                  id="input-address"
                  className=" rounded-lg border-transparent flex-1 appearance-none border border-ceruleanBlue-40 w-full py-2 px-4 bg-ceruleanBlue-10 text-ceruleanBlue-130 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-ceruleanBlue-100 focus:border-transparent"
                  name="address"
                  placeholder="0x608060405234801561001057600080fd5b5061012f8061002060..."
                  value={customByteCode}
                  onChange={handleCustomBytecodeChange}
                />
              </div>
              <div className="w-full flex flex-col items-center">
                <button
                  type="submit"
                  className="mt-1 py-2 px-4 w-full bg-ceruleanBlue-100 hover:bg-ceruleanBlue-130 focus:ring-ceruleanBlue-70 focus:ring-offset-ceruleanBlue-10 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                >
                  Decode
                </button>
              </div>
            </div>
          </form>
          <Explainer className="mt-8" />
        </div>
      </div>
    </div>
  );
}

export default App;
