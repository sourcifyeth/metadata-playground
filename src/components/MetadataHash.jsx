import IPFSLogo from "../assets/IPFS_logo.png";

const MetadataHash = ({ metadataHash }) => {
  if (!metadataHash) {
    return <div>No metadata hash found</div>;
  }
  return (
    <div>
      <div className={"font-mono break-all"}>
        {metadataHash.origin + "://" + metadataHash.hash}
      </div>
      <div className="flex justify-center mt-2">
        {metadataHash.origin === "ipfs" ? (
          <a
            href={"https://ipfs.io/ipfs/" + metadataHash.hash}
            target="_blank"
            className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            <span>
              {" "}
              View on{" "}
              <img
                src={IPFSLogo}
                className="inline-block mx-1 w-auto"
                style={{ height: "1.2em" }}
              />{" "}
            </span>
          </a>
        ) : (
          <span>
            Since it is a Swarm link it is probably not possible to retrieve the
            file 🙁 but you can try the{" "}
            <a
              href={"https://gateway.ethswarm.org/access/" + metadataHash.hash}
              target="_blank"
              className="underline"
            >
              {" "}
              Swarm gateway{" "}
            </a>
          </span>
        )}
      </div>
    </div>
  );
};
export default MetadataHash;
