import React, { useCallback } from "react";
import CollapsibleCode from "./CollapsibleCode";
import IPFSButton from "./IPFSButton";

const IPFS_GATEWAY = "https://ipfs.io/ipfs";

const extractIpfsHashFromSource = (source) => {
  return source.urls.filter((url) => url.startsWith("dweb:/"))[0].split("/")[2];
};

const FetchedSource = ({ source }) => {
  const [sourceContent, setSourceContent] = React.useState(null);
  const [sourceError, setSourceError] = React.useState(null);
  const [sourceLoading, setSourceLoading] = React.useState(false);

  const loadSource = useCallback(() => {
    if (!source) {
      return;
    }
    const controller = new AbortController();
    setSourceLoading(true);
    setSourceContent(null);
    setSourceError(null);
    // 15 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let sourceIPFShash = extractIpfsHashFromSource(source);

    return fetch(`${IPFS_GATEWAY}/${sourceIPFShash}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (res.status === 200) return res.text();
        throw new Error(
          `IPFS gateway ${IPFS_GATEWAY} returned status code ${res.status}`
        );
      })
      .then((text) => {
        setSourceError("");
        setSourceContent(text);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        setSourceError(err.message);
      })
      .finally(() => setSourceLoading(false));
  }, [source]);

  React.useEffect(() => {
    return loadSource();
  }, [loadSource]);

  if (!source) return null;
  if (sourceError)
    return (
      <div className="text-sm text-red-400">
        Error fetching source file: {sourceError}
      </div>
    );
  if (sourceLoading) {
    return (
      <div className="flex flex-row items-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-5 w-5 mr-2" />
        <span>Looking for the metadata file on IPFS</span>
      </div>
    );
  }
  return (
    <div className="w-full mt-2">
      {sourceContent ? (
        <div>
          <div className="mt-1">
            <span>Source file available on IPFS!</span>
          </div>
          <CollapsibleCode language="solidity">{sourceContent}</CollapsibleCode>
        </div>
      ) : (
        <div className="mt-2">
          <span>Couldn't find the source file on IPFS</span>
          <button
            className="ml-1 py-2 px-4 bg-transparent hover:bg-ceruleanBlue-100 hover:text-gray-50  text-ceruleanBlue-100 transition ease-in duration-200 text-center text-base font-semibold focus:outline-none rounded-lg disabled:opacity-50 disabled:cursor-default"
            onClick={loadSource}
          >
            Reload
          </button>
        </div>
      )}
    </div>
  );
};

const Sources = ({ metadataJson }) => {
  if (!metadataJson) {
    return null;
  }
  const { sources } = metadataJson;
  if (!sources) {
    return null;
  }
  const sourceKeys = Object.keys(sources);
  if (!sourceKeys.length) {
    return null;
  }
  return (
    <div className="mt-4">
      <p className="text-xl font-bold text-gray-900">Sources</p>
      <div className="mt-2">
        {sourceKeys.map((sourceKey) => {
          const source = sources[sourceKey];
          return (
            <div key={sourceKey} className="mb-8">
              <p className="font-semibold text-gray-900">{sourceKey}</p>

              <div className="mt-2">
                {source.content ? (
                  <>
                    <div className="text-sm">
                      Source code found in the metadata file
                    </div>
                    <CollapsibleCode language="solidity">
                      {source.content}
                    </CollapsibleCode>
                  </>
                ) : (
                  <>
                    <IPFSButton
                      metadataHashStr={extractIpfsHashFromSource(source)}
                    />
                    <FetchedSource source={source} />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sources;
