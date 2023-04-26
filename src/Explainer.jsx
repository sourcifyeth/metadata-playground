import { useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import bashLang from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import jsonLang from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import terminalStyle from "react-syntax-highlighter/dist/esm/styles/hljs/ir-black";
import codeStyle from "react-syntax-highlighter/dist/esm/styles/hljs/mono-blue";
import metadataStr from "./assets/metadata";

SyntaxHighlighter.registerLanguage("json", jsonLang);
SyntaxHighlighter.registerLanguage("bash", bashLang);

const ToggleDisplayCodeButton = ({ toggleCollapse, codeCollapsed }) => {
  return (
    <button
      className="mt-1 py-2 w-full px-4 bg-transparent hover:bg-ceruleanBlue-100 hover:text-gray-50 focus:ring-ceruleanBlue-70 focus:ring-offset-ceruleanBlue-10 text-ceruleanBlue-100 transition ease-in duration-200 text-center text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg disabled:opacity-50 disabled:cursor-default"
      onClick={toggleCollapse}
    >
      {codeCollapsed ? "Expand" : "Collapse"}
    </button>
  );
};
export default function Explainer(props) {
  const [codeCollapsed, setCodeCollapsed] = useState(true);
  const h1Class = "text-3xl mb-2 font-medium text-gray-900";

  const h2Class = "text-lg font-medium text-gray-900";

  const decodedCbor = {
    ipfs: "0x1220c019e4614043d8adc295c3046ba5142c603ab309adeef171f330c51c38f14989",
    solc: "0x000804",
  };

  const toggleCollapse = () => setCodeCollapsed((current) => !current);

  return (
    <div {...props}>
      <div className="text-gray-900 mt-2 mb-20 break-words">
        <h1 className={h1Class}>What is Metadata?</h1>
        <div className="mt-2">
          The metadata.json file contains information about the compiled smart
          contract.{" "}
          <a
            href="https://docs.soliditylang.org/en/latest/metadata.html"
            target="_blank"
            className="text-gray-600 text-sm"
            rel="noreferrer"
          >
            (See in Solidity docs)
          </a>
        </div>
        <div className="mt-4">The metadata.json looks like this:</div>
        <div
          className={`flex flex-col overflow-hidden transition-all ease-out duration-500`}
          style={
            codeCollapsed ? { maxHeight: "5rem" } : { maxHeight: "150rem" }
          }
        >
          <SyntaxHighlighter
            language="json"
            style={codeStyle}
            className="text-xs md:text-sm text-left"
          >
            {metadataStr}
          </SyntaxHighlighter>
        </div>
        <ToggleDisplayCodeButton
          toggleCollapse={toggleCollapse}
          codeCollapsed={codeCollapsed}
        />
        <div className="mt-8">
          When a smart contract is compiled, its metadata file is generated and
          the metadata file hash is stored at the end of the bytecode
        </div>
        <div className="mt-6 break-all">
          <div className="font-bold">
            Bytecode of{" "}
            <a
              className="underline"
              href="https://goerli.etherscan.io/address/0x00878Ac0D6B8d981ae72BA7cDC967eA0Fae69df4#code"
              target="_blank"
              rel="noreferrer"
            >
              0x00878Ac0D6B8d981ae72BA7cDC967eA0Fae69df4 (Görli)
            </a>
          </div>
          <div className="font-mono bg-gray-100 m-1 p-4 text-left">
            608060405234801561001057600080fd5b5061012f806100206000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d146051575b600080fd5b603d6069565b6040516048919060c2565b60405180910390f35b6067600480360381019060639190608f565b6072565b005b60008054905090565b8060008190555050565b60008135905060898160e5565b92915050565b60006020828403121560a057600080fd5b600060ac84828501607c565b91505092915050565b60bc8160db565b82525050565b600060208201905060d5600083018460b5565b92915050565b6000819050919050565b60ec8160db565b811460f657600080fd5b5056fe
            <span className="font-semibold">
              a2646970667358221220c019e4614043d8adc295c3046ba5142c603ab309adeef171f330c51c38f1498964736f6c63430008040033
            </span>
          </div>
          <div>
            <div className="mt-8 mb-2">
              <span className="text-ceruleanBlue-100 font-semibold font-mono break-all">
                a2646970667358221220c019e4614043d8adc295c3046ba5142c603ab309adeef171f330c51c38f1498964736f6c6343000804
              </span>
              <span className="text-yellow-800 font-semibold">0033</span>
            </div>{" "}
            <div>
              are the bytes appended by the Solidity compiler. It is encoded in{" "}
              <a
                href="https://en.wikipedia.org/wiki/CBOR"
                target="_blank"
                className="underline"
                rel="noreferrer"
              >
                CBOR
              </a>{" "}
              and by default contains the Solidity version and the metadata hash
              (depending on the compiler version and compiler preferences).
            </div>
            <div className="my-6">Lets decode it:</div>
            <div className="text-left">
              <div>
                <span className="text-yellow-800 font-semibold font-mono">
                  0033{" "}
                </span>
                <span>= CBOR length:</span>{" "}
                <pre className={"inline-block bg-yellow-800 text-gray-50"}>
                  51 Bytes
                </pre>
              </div>
              <div className="text-ceruleanBlue-100 font-semibold mt-2 font-mono break-all">
                a2646970667358221220c019e4614043d8adc295c3046ba5142c603ab309adeef171f330c51c38f1498964736f6c6343000804
              </div>
              <pre className={"overflow-x-auto bg-blue-900 text-gray-50"}>
                {JSON.stringify(decodedCbor, null, 2)}
              </pre>
              <div className="text-xs text-gray-700">
                <a
                  href="https://cbor.me/?bytes=a2646970667358221220c019e4614043d8adc295c3046ba5142c603ab309adeef171f330c51c38f1498964736f6c63430008040033  "
                  target="_blank"
                  rel="noreferrer"
                >
                  See on CBOR Playground
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          The IPFS hash above is in hex bytes. IPFS uses{" "}
          <a
            className="underline"
            href="https://github.com/multiformats/multibase"
            target="_blank"
            rel="noreferrer"
          >
            multibase
          </a>{" "}
          that allows representing the same set of bytes in different
          characters. The bytes{" "}
          <span className="font-mono font-bold">
            0x1220c019e4614043d8adc295c3046ba5142c603ab309adeef171f330c51c38f14989
          </span>{" "}
          will correspond to this IPFS cid/hash:{" "}
          <b>QmbGXtNqvZYEcbjK6xELyBQGEmzqXPDqyJNoQYjJPrST9S.</b>{" "}
          <a
            href="https://cid.ipfs.io/#QmbGXtNqvZYEcbjK6xELyBQGEmzqXPDqyJNoQYjJPrST9S"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 text-sm"
          >
            (See the breakdown of the cid)
          </a>
        </div>

        <div className="mt-8">
          <div className="text-lg">Here's the magic 🪄</div>
          <div className="mt-2">
            If published on IPFS you can now get this metadata file using the
            hash QmbGXtNqvZYEcbjK6xELyBQGEmzqXPDqyJNoQYjJPrST9S.
          </div>
          <div className="text-lg mt-4">
            <div>Try it! 👇</div>
            <div>
              <a
                href="https://ipfs.io/ipfs/QmbGXtNqvZYEcbjK6xELyBQGEmzqXPDqyJNoQYjJPrST9S"
                target="_blank"
                className="text-ceruleanBlue-100 hover:underline"
                rel="noreferrer"
              >
                https://ipfs.io/ipfs/QmbGXtNqvZYEcbjK6xELyBQGEmzqXPDqyJNoQYjJPrST9S
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h1 className={h1Class}>Ok, so what 🤷‍♂️</h1>
          <p>
            One thing this allows us to do is <b>source code verification</b>.
          </p>
          <br />
          <p>
            Since the source file <b>hashes</b> are included in the metadata
            file, even if a single byte of source files changes, the metadata
            hash changes too. That means, if we can compile a contract with
            given source files and the bytecode + the appended metadata hash are
            exactly the same as an on-chain contract, we can be sure that this
            is a byte-by-byte match of the same source files and the same
            compilation settings.
          </p>
          <p>
            This is what we are doing at{" "}
            <a href="https://sourcify.dev" target="_blank" rel="noreferrer">
              Sourcify
            </a>
            . For more information check out the{" "}
            <a
              href="https://docs.sourcify.dev/"
              target="_blank"
              className="underline"
              rel="noreferrer"
            >
              Sourcify Docs
            </a>{" "}
            article.
          </p>
        </div>

        <div className="mt-12">
          <h1 className={h1Class}>Where can I find the metadata file? 🤔</h1>

          <div className="">
            <h2 className={h2Class}>Solidity compiler</h2>
            <p className="mt-2">
              The solidity compiler outputs the metadata with the --metadata
              option
            </p>
            <SyntaxHighlighter
              language="bash"
              style={terminalStyle}
              className="text-xs md:text-sm"
            >
              $ solc --metadata MyContract.sol
            </SyntaxHighlighter>
          </div>

          <div className="mt-8">
            <h2 className={h2Class}>Truffle</h2>
            <p className="mt-2">
              If using Truffle, it is saved as a string in
              build/contracts/MyContract.json in the metadata field{" "}
            </p>
            <SyntaxHighlighter
              language="bash"
              style={terminalStyle}
              className="text-xs md:text-sm"
            >
              {`$ truffle compile
$ cd build/contracts
$ cat MyContract.json
{
  "contractName": "MyToken",
  "abi": [...]
  “metadata”: "{\\"compiler\\":{\\"version\\":\\"0.8.4+commit.c7e474f2\\"},\\"language\\":\\"Solidity\\",\\"output\\":{\\"abi\\":[{\\"inputs\\":[{\\"internalType\\":\\"string\\",\\"name\\":\\"name\\",\\"type\\":\\"string\\"},{\\
  ....
,\\"version\\":1}",
  “bytecode”: “...”
...
}
`}
            </SyntaxHighlighter>
          </div>

          <div className="mt-8">
            <h2 className={h2Class}>Hardhat</h2>
            <p className="mt-2">
              With Hardhat version &gt;2.8.0 the metadata of contracts are
              output in the build-info files
            </p>
            <SyntaxHighlighter
              language="bash"
              style={terminalStyle}
              className="text-xs md:text-sm"
            >
              {`$ hardhat compile
$ cd artifacts/build-info
$ cat 901568e56d422b1e1e3f64004cb4dd6e.json
{
  "id": "901568e56d422b1e1e3f64004cb4dd6e",
  "_format": "hh-sol-build-info-1",
  "solcVersion": "0.8.6",
  "solcLongVersion": "0.8.6+commit.11564f7e",
  "input": {
  ...
  },
  "output": {
    "contracts": {
      "MyContract.sol": {
        "MyContract": {
          "abi": [
          ],
          "evm": {
          },
          "metadata": "{\\"compiler\\":{\\"version\\":\\"0.8.6+commit.11564f7e\\"},\\"language\\":\\"Solidity\\",\\"output...
  } 
`}
            </SyntaxHighlighter>
            <br />
            <p>
              If you are using an older Hardhat version you can manually enable
              the metadata output in the hardhat-config.js file:{" "}
            </p>
            <SyntaxHighlighter
              language="json"
              style={codeStyle}
              className="text-xs md:text-sm"
            >
              {`{
...
solidity: {
  settings: {
        optimizer: optimizerConfig,
        outputSelection: {
          "*": {
            "*": [
              "abi",
              "evm.bytecode",
              "evm.deployedBytecode",
              "evm.methodIdentifiers",
              "metadata", // add this
            ],
            "": ["ast"],
          },
        },
      },
  }
}
`}
            </SyntaxHighlighter>
          </div>
        </div>
        <div className="mt-8">
          You can directly use the Hardhat and Truffle output files in Sourcify
          without extracting it manually. Sourcify does the work for you
        </div>
      </div>
    </div>
  );
}
