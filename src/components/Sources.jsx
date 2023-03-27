import React from "react";
import CollapsibleCode from "./CollapsibleCode";

const IPFS_GATEWAY = "https://ipfs.io/ipfs";

const FetchedSource = ({ source }) => {
  const [sourceContent, setSourceContent] = React.useState(null);
  const [sourceError, setSourceError] = React.useState(null);
  const [sourceLoading, setSourceLoading] = React.useState(false);

  React.useEffect(() => {
    if (!source) {
      return;
    }
    const controller = new AbortController();
    setSourceLoading(true);
    setSourceContent(null);
    setSourceError(null);
    // 15 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let sourceIPFShash = source.urls
      .filter((url) => url.startsWith("dweb:/"))[0]
      .split("/")[2];

    return fetch(`${IPFS_GATEWAY}/${sourceIPFShash}`, {
      signal: controller.signal,
    })
      .then((res) => res.text())
      .then((text) => setSourceContent(text))
      .catch((err) => {
        clearTimeout(timeoutId);
        setSourceError(err);
      })
      .finally(() => setSourceLoading(false));
  }, [source]);

  if (!source) return null;
  if (sourceError) return <div>Error fetching source file: {sourceError}</div>;
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
          <div className="mt-1">Source file available on IPFS!</div>
          <CollapsibleCode language="solidity">{sourceContent}</CollapsibleCode>
        </div>
      ) : (
        <div className="mt-2">"Couldn't find the source file on IPFS"</div>
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
                  <CollapsibleCode language="solidity">
                    {source.content}
                  </CollapsibleCode>
                ) : (
                  <FetchedSource source={source} />
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
