import { useEffect, useState } from "react";
import logo from "../assets/sourcify.png";

const SourcifyButton = ({ chain, address }) => {
  const sourcifyFullMatchUrl = `https://repo.sourcify.dev/contracts/full_match/${chain}/${address}`;
  const sourcifyPartialMatchUrl = `https://repo.sourcify.dev/contracts/partial_match/${chain}/${address}`;
  const [match, setMatch] = useState(null);
  useEffect(() => {
    fetch(sourcifyFullMatchUrl)
      .then((res) => {
        if (res.status === 200) {
          setMatch("full");
        }
      })
      .catch((err) => {
        fetch(sourcifyPartialMatchUrl)
          .then((res) => {
            console.log("Checking partial");
            if (res.status === 200) {
              setMatch("partial");
            }
          })
          .catch((err) => {
            setMatch(null);
          });
      });
  }, [sourcifyFullMatchUrl, sourcifyPartialMatchUrl]);

  let url;

  if (match === "full") url = sourcifyFullMatchUrl;
  else if (match === "partial") url = sourcifyPartialMatchUrl;
  else {
    url = null;
  }

  return (
    <button
      className="flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-default disabled:opacity-50 disabled:text-gray-500"
      disabled={!match}
    >
      <img src={logo} width={16} className="mr-1" />
      <a href={url} target="_blank">
        {match ? "View on Sourcify" : "Not found on Sourcify"}
      </a>
    </button>
  );
};

export default SourcifyButton;
