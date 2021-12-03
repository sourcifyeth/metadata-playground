import ContractCallDecoder from "@ethereum-sourcify/contract-call-decoder";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";
import Connecting from "./components/Connecting";
import CustomSelectSearch from "./components/CustomSelectSearch/CustomSelectSearch";
import Modal from "./components/Modal";
import Shuffle from "./components/Shuffle";

function App() {
  const [byteCode, setByteCode] = useState();
  const [pastedByteCode, setPastedByteCode] = useState();
  const [decodedCbor, setDecodedCbor] = useState();
  const [metadataHash, setMetadataHash] = useState();
  const [provider, setProvider] = useState();
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [chainIndex, setChainIndex] = useState();
  const [chainObject, setChainObject] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [customByteCode, setCustomByteCode] = useState();
  const [chainArray, setChainArray] = useState();
  const [connected, setConnected] = useState("not connected");

  useEffect(() => {
    fetch("https://chainid.network/chains.json")
      .then((res) => res.json())
      .then((json) => {
        setChainArray(json);
        setChainObject(json[0]);
        setChainIndex(0);
        handleProviderChange(json[0]);
      });
    // .catch(() => alert("Couldn't fetch networks"));
  }, []);

  const handleChainAndContractChange = (chainId, address) => {
    const chainIndex = chainArray.findIndex(
      (chainObj) => chainObj.chainId === chainId
    );
    setErrorMessage();
    handleChainChange(chainIndex);
    setAddress(address);
  };

  const handleChainChange = (index) => {
    setErrorMessage();
    setChainIndex(index);
    setChainObject(chainArray[index]);
    handleProviderChange(chainArray[index]);
  };

  const handleProviderChange = (chainlistObject) => {
    if (!chainlistObject) return;
    setConnected("connecting");
    let provider;
    // Ethereum networks
    if ([1, 3, 4, 5, 42].includes(chainlistObject.chainId)) {
      provider = new ethers.providers.InfuraProvider(
        chainlistObject.chainId,
        process.env.REACT_APP_INFURA_KEY
      );
    } else if (chainlistObject.chainId === 42161) {
      // Arbitrum One
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
        console.log(data);
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
  };

  const handleAddressChange = (e) => {
    e.preventDefault();
    setErrorMessage();
    setAddress(e.target.value);
  };

  const handleBytecodeChange = (e) => {
    e.preventDefault();
    setErrorMessage();
    const input = e.target.value;
    const formattedBytecode = input.startsWith("0x")
      ? input.trim()
      : "0x" + input.trim();
    console.log(formattedBytecode);
    setCustomByteCode(formattedBytecode);
  };

  const decodeBytecodeCbor = (byteCode) => {
    const formattedBytecode = byteCode.startsWith("0x")
      ? byteCode.trim()
      : "0x" + byteCode.trim();
    try {
      const hashObject =
        ContractCallDecoder.decodeCborAtTheEnd(formattedBytecode);
      return hashObject;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setErrorMessage();
    let code;
    try {
      code = await provider.getCode(address);
      console.log(address);
    } catch (err) {
      if (err) {
        return setErrorMessage(err.message);
      }
    }
    if (code == "0x") {
      return setErrorMessage("No contract found at the address");
    }
    setByteCode(code);
    setModalOpen(true);
    const decodedCbor = await decodeBytecodeCbor(code);
    if (decodedCbor) {
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

  const handleConvertByteCode = (e) => {
    e.preventDefault();
    const decoded = decodeBytecodeCbor(customByteCode);
    console.log("Decoded");
    console.log(decoded);
  };
  // provider && provider.getBlockNumber().then(console.log);

  if (!chainArray) {
    return "Loading";
  }
  return (
    <div className="App mx-4 md:mx-48">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        byteCode={byteCode}
        decodedCbor={decodedCbor}
        metadataHash={metadataHash}
        address={address}
        chainObject={chainObject}
      />
      <div className="flex flex-col items-center mt-8 md:mt-16">
        <img
          className="w-20 md:w-24"
          src={process.env.PUBLIC_URL + "/solidity.png"}
          alt="Solidity logo"
        />

        <div className="mt-4 text-2xl font-medium">Solidity metadata.json</div>
        <div className="mt-1 mb-4 text-sm md:text-base text-center text-gray-700">
          It is everything you need to reproduce a smart contract compilation
          and to verify its source
        </div>
        <div>
          {chainArray ? (
            <div>
              <Connecting connected={connected} />
              <CustomSelectSearch
                options={chainArray.map((chain, i) => ({
                  name: `#${chain.chainId} ${chain.name}`,
                  value: i,
                }))}
                value={chainIndex}
                onChange={handleChainChange}
              />
              <div className="text-xs text-gray-600 text-center mt-1">
                Network list from{" "}
                <a
                  className="underline hover:text-gray-900"
                  href="https://github.com/ethereum-lists/chains"
                  target="_blank"
                >
                  ethereum-lists/chains
                </a>
              </div>
              <div className="text-xs text-gray-600 text-center mt-1">
                Contracts from{" "}
                <a
                  className="underline hover:text-gray-900"
                  href="https://github.com/ethereum-lists/contracts"
                  target="_blank"
                >
                  ethereum-lists/contracts
                </a>
              </div>
            </div>
          ) : (
            <div> Loading chain list </div>
          )}
        </div>
        <div className="text-red-800 text-sm text-center">{errorMessage}</div>
      </div>
      <div>
        <form noValidate onSubmit={handleSubmitAddress} key="form">
          <div className="mt-8 text-gray-700">
            <div className="flex justify-between">
              <span className="text-sm md:text-base">
                Enter Contract Address or ENS
              </span>
              <Shuffle
                handleChainAndContractChange={handleChainAndContractChange}
              />
            </div>

            <div className="mt-2">
              <input
                type="text"
                id="input-address"
                class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-ceruleanBlue-100 focus:border-transparent"
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
                Decode Metadata Hash
              </button>
            </div>
          </div>
        </form>
      </div>
      <div>
        <form noValidate onSubmit={handleConvertByteCode} key="form">
          <div className="text-sm md:text-base mt-8 text-gray-700">
            <div>or paste contract bytecode</div>

            <div className="mt-2">
              <textarea
                type="text"
                id="input-address"
                class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-ceruleanBlue-100 focus:border-transparent"
                name="address"
                placeholder="0x34a...456d"
                value={pastedByteCode}
                onChange={handleBytecodeChange}
              />
            </div>
            <div className="w-full flex flex-col items-center">
              <button
                type="submit"
                className="mt-1 py-2 px-4 w-full bg-ceruleanBlue-100 hover:bg-ceruleanBlue-130 focus:ring-ceruleanBlue-70 focus:ring-offset-ceruleanBlue-10 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Decode Metadata Hash
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
