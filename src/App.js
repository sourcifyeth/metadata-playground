import ContractCallDecoder from "@ethereum-sourcify/contract-call-decoder";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
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
  const [sourcifyChains, setSourcifyChains] = useState();
  const [etherscanChains, setEtherscanChains] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [customByteCode, setCustomByteCode] = useState();
  const [chainArray, setChainArray] = useState(); // chainId.network/chains.json result
  const [connected, setConnected] = useState("not connected");
  const [selectedRpcs, setSelectedRpcs] = useState({}); // chainId -> rpc URL mapping
  const [currentRpc, setCurrentRpc] = useState(null); // Currently active RPC URL

  // On Mount
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const paramAddress = urlParams.get("address");
    const paramChainId = parseInt(urlParams.get("chainId"));
    const paramBytecode = urlParams.get("bytecode");
    fetch("https://chainid.network/chains.json")
      .then((res) => res.json())
      .then((arr) => {
        const ethereumChainIds = [1, 11155111, 560048];
        // move ethereum networks to the top
        const sortedArr = arr.sort((a, b) => {
          if (ethereumChainIds.includes(a.chainId) && ethereumChainIds.includes(b.chainId)) {
            return a.chainId - b.chainId;
          } else if (ethereumChainIds.includes(a.chainId)) {
            return -1;
          } else if (ethereumChainIds.includes(b.chainId)) {
            return 1;
          } else {
            return a.chainId - b.chainId;
          }
        });
        setChainArray(sortedArr);
        setChainObject(sortedArr[0]);
        setChainIndex(0);
        if (paramAddress) {
          setAddress(paramAddress);
        }
        if (paramChainId) {
          const chainIndex = sortedArr.findIndex((chainObj) => chainObj.chainId === paramChainId);
          setChainIndex(chainIndex);
        }
        if (paramBytecode) {
          setCustomByteCode(paramBytecode);
        }
      })
      .catch(() => alert("Couldn't fetch networks"));

    fetch("https://sourcify.dev/server/chains")
      .then((res) => res.json())
      .then((arr) => {
        setSourcifyChains(arr);
      });

    fetch("https://api.etherscan.io/v2/chainlist")
      .then((res) => res.json())
      .then((response) => {
        setEtherscanChains(response.result);
      });
  }, []);

  // On chainIndex change
  useEffect(() => {
    if (!chainArray) return;
    setErrorMessage();
    setConnected("connecting");
    const chainlistObject = chainArray[chainIndex];

    // Find a working RPC URL from the chain data
    let provider;
    let rpcUrl = null;

    // Use selected RPC if available, otherwise try RPCs until one works
    if (selectedRpcs[chainlistObject.chainId]) {
      rpcUrl = selectedRpcs[chainlistObject.chainId];

      if (rpcUrl) {
        try {
          provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
            name: chainlistObject.name,
            chainId: chainlistObject.chainId,
            ensAddress: chainlistObject?.ens?.registry,
          });
        } catch (err) {
          console.error(err);
        }
      }

      setProvider(provider);
      if (provider) {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));

        Promise.race([provider.getNetwork(), timeoutPromise])
          .then(() => {
            setConnected("connected");
            setCurrentRpc(rpcUrl);
          })
          .catch(() => {
            setErrorMessage("Can't connect to the network at " + rpcUrl);
            setConnected("not connected");
            setCurrentRpc(null);
          });
      }
    } else {
      // Auto-select: race all RPCs and use the fastest one
      const publicRpcs =
        chainlistObject.rpc?.filter(
          (rpc) =>
            !rpc.includes("infura.io") &&
            !rpc.includes("cloudflare-eth.com") &&
            !rpc.includes("${") &&
            rpc.startsWith("http")
        ) || [];

      if (publicRpcs.length > 0) {
        // Create promises for all RPCs with timeout
        const rpcPromises = publicRpcs.map(async (rpcUrl) => {
          const testProvider = new ethers.providers.JsonRpcProvider(rpcUrl, {
            name: chainlistObject.name,
            chainId: chainlistObject.chainId,
            ensAddress: chainlistObject?.ens?.registry,
          });

          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));

          await Promise.race([testProvider.getNetwork(), timeoutPromise]);
          return { provider: testProvider, url: rpcUrl };
        });

        // Race all RPCs and use the first one that succeeds
        Promise.any(rpcPromises)
          .then(({ provider, url }) => {
            setProvider(provider);
            setConnected("connected");
            setCurrentRpc(url);
            console.log(`Successfully connected to fastest RPC: ${url}`);
          })
          .catch(() => {
            setErrorMessage("Can't connect to any available RPC");
            setConnected("not connected");
            setCurrentRpc(null);
          });
      } else {
        setErrorMessage("No public RPCs available");
        setConnected("not connected");
        setCurrentRpc(null);
      }
    }
  }, [chainIndex, chainArray, selectedRpcs]);

  const chainIdToIndex = (id) => {
    const chainIndex = chainArray.findIndex((chainObj) => chainObj.chainId === id);
    return chainIndex;
  };

  const handleRpcChange = (chainId, rpcUrl) => {
    setSelectedRpcs((prev) => ({
      ...prev,
      [chainId]: rpcUrl,
    }));
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
    const formattedBytecode = input.startsWith("0x") ? input.trim() : "0x" + input.trim();
    setCustomByteCode(formattedBytecode);
  };

  const decodeBytecodeCbor = (byteCode) => {
    let decodedCbor;
    const formattedBytecode = byteCode.startsWith("0x") ? byteCode.trim() : "0x" + byteCode.trim();
    try {
      decodedCbor = ContractCallDecoder.decodeCborAtTheEnd(formattedBytecode);
    } catch (err) {
      console.error(err);
      if (err.message.startsWith("Unexpected data")) {
        setErrorMessage("Unable to decode bytecode with CBOR");
      } else {
        setErrorMessage("Unable to decode bytecode with CBOR\n" + err.message);
      }
      return null;
    }
    if (decodedCbor) {
      setModalOpen(true);
      const stringifyBuffers = {}; // show buffers in hex
      Object.keys(decodedCbor).forEach((key) => {
        stringifyBuffers[key] =
          typeof decodedCbor[key] === "boolean" ? decodedCbor[key] : "0x" + decodedCbor[key].toString("hex");
      });
      setDecodedCbor(stringifyBuffers);
      try {
        const metadataHash = ContractCallDecoder.getHashFromDecodedCbor(decodedCbor);
        setMetadataHash(metadataHash);
      } catch (err) {
        setMetadataHash(null);
      }
    } else {
      setDecodedCbor(null);
      setMetadataHash(null);
    }
  };

  const handleSubmitAddress = useCallback(
    async (e) => {
      if (e) e.preventDefault();
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
        return setErrorMessage("No contract found at the address on chain " + provider.network.name);
      }
      setByteCode(code);
      decodeBytecodeCbor(code);
    },
    [address, provider]
  );


  const handleDecodeCustomByteCode = useCallback(
    (e) => {
      if (e) e.preventDefault();
      console.log("Decoding custom");
      setAddress("");
      setByteCode(customByteCode);
      decodeBytecodeCbor(customByteCode);
    },
    [customByteCode]
  );

  const handleModalClose = () => {
    setModalOpen(false);
    setMetadataHash(null);
    setDecodedCbor(null);
    setByteCode(null);
  };

  // On provider change, if address and chainId query params are present, handleSubmitAddress
  useEffect(() => {
    if (!provider) return;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const paramAddress = urlParams.get("address");
    const paramChainId = parseInt(urlParams.get("chainId"));
    if (paramAddress && paramChainId) {
      handleSubmitAddress();
    }
  }, [provider, handleSubmitAddress]);

  // Submit automatically if bytecode is present in query params
  useEffect(() => {
    if (!customByteCode) return;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const paramBytecode = urlParams.get("bytecode");
    if (paramBytecode) {
      handleDecodeCustomByteCode();
    }
  }, [customByteCode, handleDecodeCustomByteCode]);

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
          chainObject={chainArray[chainIndex]}
          sourcifyChains={sourcifyChains}
          etherscanChains={etherscanChains}
        />
        <div className="flex flex-col items-center">
          <img className="w-12 md:w-16" src={process.env.PUBLIC_URL + "/solidity.png"} alt="Solidity logo" />

          <h1 className="mt-2 text-2xl md:text-5xl font-medium vt323 text-center">Solidity metadata.json playground</h1>
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
                {chainArray[chainIndex]?.rpc?.length > 0 && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select RPC Endpoint:</label>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceruleanBlue-100 focus:border-ceruleanBlue-100 text-sm"
                      value={selectedRpcs[chainArray[chainIndex].chainId] || ""}
                      onChange={(e) => handleRpcChange(chainArray[chainIndex].chainId, e.target.value)}
                    >
                      <option value="">Auto-select (default)</option>
                      {chainArray[chainIndex].rpc
                        .filter(
                          (rpc) =>
                            !rpc.includes("infura.io") &&
                            !rpc.includes("cloudflare-eth.com") &&
                            !rpc.includes("${") &&
                            rpc.startsWith("http")
                        )
                        .map((rpc, i) => (
                          <option key={i} value={rpc}>
                            {rpc.length > 50 ? rpc.substring(0, 50) + "..." : rpc}
                          </option>
                        ))}
                    </select>
                    {selectedRpcs[chainArray[chainIndex].chainId] ? (
                      <div className="text-xs text-gray-600 mt-1">
                        Using: {selectedRpcs[chainArray[chainIndex].chainId]}
                      </div>
                    ) : (
                      currentRpc && <div className="text-xs text-gray-600 mt-1 flex">Auto-selected: {currentRpc}</div>
                    )}
                  </div>
                )}
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
                <div className="text-sm md:text-base flex items-end">Enter Contract Address or ENS</div>
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
                  Get Bytecode and Decode
                </button>
              </div>
              <div className="mt-2 text-center">
                {" "}
                <div className="mt-4">Click to decode some example contracts:</div>
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
                      <div className="text-xs text-gray-500">{contract.info}</div>
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
