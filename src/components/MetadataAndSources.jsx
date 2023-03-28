import { useCallback, useEffect, useState } from "react";
import CollapsibleCode from "./CollapsibleCode";
import IPFSButton from "./IPFSButton";
import Sources from "./Sources";

const IPFS_GATEWAY = "https://ipfs.io/ipfs";

const FetchedMetadata = ({
  metadataHashStr,
  metadataJson,
  setMetadataJson,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMetadata = useCallback(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setMetadataJson(null);
    // 15 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    setError("");
    return fetch(`${IPFS_GATEWAY}/${metadataHashStr}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error(
          `IPFS gateway ${IPFS_GATEWAY} returned status code ${res.status}`
        );
      })
      .then((json) => {
        setError("");
        setMetadataJson(json);
      })
      .catch((err) => {
        setError(err.message);
        clearTimeout(timeoutId);
        setMetadataJson(null);
      })
      .finally(() => setIsLoading(false));
  }, [metadataHashStr]);

  useEffect(() => {
    return loadMetadata();
  }, [loadMetadata]);

  if (!metadataHashStr) return null;
  return (
    <div className="w-full mt-2">
      <div className="mt-1 text-sm text-red-400">{error}</div>
      {metadataJson ? (
        <div>
          <div className="mt-1">Metadata file available on IPFS!</div>

          <CollapsibleCode language="json">
            {JSON.stringify(metadataJson, null, 2)}
          </CollapsibleCode>
        </div>
      ) : (
        <div className="mt-2">
          {isLoading ? (
            <div className="flex flex-row items-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-5 w-5 mr-2" />
              <span>Looking for the metadata file on IPFS</span>
            </div>
          ) : (
            <div>
              <span>Couldn't find the metadata file on IPFS </span>
              <button
                className="ml-1 py-2 px-4 bg-transparent hover:bg-ceruleanBlue-100 hover:text-gray-50  text-ceruleanBlue-100 transition ease-in duration-200 text-center text-base font-semibold focus:outline-none rounded-lg disabled:opacity-50 disabled:cursor-default"
                onClick={loadMetadata}
              >
                Reload
              </button>
            </div>
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
const MetadataAndSources = ({ metadataHash }) => {
  const [metadataJson, setMetadataJson] = useState();

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
            <FetchedMetadata
              metadataHashStr={metadataHash.hash}
              metadataJson={metadataJson}
              setMetadataJson={setMetadataJson}
            />
            <Sources metadataJson={metadataJson} />
          </div>
        ) : (
          <Swarm metadataHash={metadataHash} />
        )}
      </div>
    </div>
  );
};
export default MetadataAndSources;
