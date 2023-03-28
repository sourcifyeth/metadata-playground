import React from "react";
import IPFSLogo from "../assets/IPFS_logo.png";

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

export default IPFSButton;
