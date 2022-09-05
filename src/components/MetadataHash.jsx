import { useEffect, useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import jsonLang from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import codeStyle from "react-syntax-highlighter/dist/esm/styles/hljs/mono-blue";
import IPFSLogo from "../assets/IPFS_logo.png";
SyntaxHighlighter.registerLanguage("json", jsonLang);

const IPFS_GATEWAY = "https://ipfs.io/ipfs";

const IPFSButton = ({ metadataHashStr }) => {
  return (
    <div className="">
      <a
        href={"https://ipfs.io/ipfs/" + metadataHashStr}
        target="_blank"
        className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
        rel="noreferrer"
      >
        <span>
          {" "}
          View on{" "}
          <img
            src={IPFSLogo}
            className="inline-block mx-1 w-auto"
            style={{ height: "1.2em" }}
            alt="Ipfs Logo"
          />{" "}
        </span>
      </a>
    </div>
  );
};
const FetchedMetadata = ({ metadataHashStr }) => {
  const [metadataJson, setMetadataJson] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [codeCollapsed, setCodeCollapsed] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setMetadataJson(null);
    // 15 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    return fetch(`${IPFS_GATEWAY}/${metadataHashStr}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((json) => setMetadataJson(json))
      .catch((err) => {
        clearTimeout(timeoutId);
        setMetadataJson(null);
      })
      .finally(() => setIsLoading(false));
  }, [metadataHashStr]);

  const toggleCollapse = () => setCodeCollapsed((current) => !current);

  if (!metadataHashStr) return null;
  return (
    <div className="w-full mt-2">
      {metadataJson ? (
        <div
          className="w-full flex flex-col overflow-hidden transition-all ease-out duration-500"
          style={
            codeCollapsed ? { maxHeight: "15rem" } : { maxHeight: "9999rem" }
          }
        >
          <div className="mt-1">Metadata file available on IPFS!</div>
          <div className="my-1">
            <button
              className="mt-1 py-2 px-4 bg-transparent hover:bg-ceruleanBlue-100 hover:text-gray-50  text-ceruleanBlue-100 transition ease-in duration-200 text-center text-base font-semibold focus:outline-none rounded-lg disabled:opacity-50 disabled:cursor-default"
              onClick={toggleCollapse}
            >
              {codeCollapsed ? "Expand" : "Collapse"}
            </button>
            <button
              className="mt-1 py-2 px-4 bg-transparent hover:bg-ceruleanBlue-100 hover:text-gray-50  text-ceruleanBlue-100 transition ease-in duration-200 text-center text-base font-semibold focus:outline-none rounded-lg disabled:opacity-50 disabled:cursor-default"
              onClick={() =>
                navigator.clipboard.writeText(
                  JSON.stringify(metadataJson, null, 2)
                )
              }
            >
              Copy to Clipboard
            </button>
          </div>

          <SyntaxHighlighter
            language="json"
            style={codeStyle}
            className="text-xs md:text-sm text-left w-full"
          >
            {JSON.stringify(metadataJson, null, 2)}
          </SyntaxHighlighter>
          <button
            className="mt-1 py-2 w-full px-4 bg-transparent hover:bg-ceruleanBlue-100 hover:text-gray-50  text-ceruleanBlue-100 transition ease-in duration-200 text-center text-base font-semibold focus:outline-none rounded-lg disabled:opacity-50 disabled:cursor-default"
            onClick={toggleCollapse}
          >
            {codeCollapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      ) : (
        <div className="mt-2">
          {isLoading ? (
            <div className="flex flex-row items-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-5 w-5 mr-2" />
              <span>Looking for the metadata file on IPFS</span>
            </div>
          ) : (
            "Couldn't find the metadata file on IPFS"
          )}
        </div>
      )}
    </div>
  );
};

const Swarm = ({ metadataHash }) => {
  return (
    <div>
      Since it is a Swarm link it is probably not possible to retrieve the file
      🙁 but you can try the{" "}
      <a
        href={"https://gateway.ethswarm.org/access/" + metadataHash.hash}
        target="_blank"
        className="underline"
        rel="noreferrer"
      >
        {" "}
        Swarm gateway{" "}
      </a>
    </div>
  );
};
const MetadataHash = ({ metadataHash }) => {
  if (!metadataHash) {
    return <div>No metadata hash found</div>;
  }
  return (
    <div>
      <div className={"font-mono break-all"}>
        {metadataHash.origin + "://" + metadataHash.hash}
      </div>
      <p className="text-lg font-bold text-gray-900 mt-2">Metadata File</p>
      <div className="">
        {metadataHash.origin === "ipfs" ? (
          <div className="flex flex-col mt-2">
            <IPFSButton metadataHashStr={metadataHash.hash} />
            <FetchedMetadata metadataHashStr={metadataHash.hash} />
          </div>
        ) : (
          <Swarm metadataHash={metadataHash} />
        )}
      </div>
    </div>
  );
};
export default MetadataHash;
