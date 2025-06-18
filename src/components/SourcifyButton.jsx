import { useEffect, useState } from "react";
import logo from "../assets/sourcify.png";

const SourcifyButton = ({ chain, address }) => {
  const sourcifyAPIUrl = `https://sourcify.dev/server/v2/contract/${chain}/${address}`;
  const sourcifyRepoUrl = `https://repo.sourcify.dev/${chain}/${address}`;
  const [match, setMatch] = useState(null);
  useEffect(() => {
    fetch(sourcifyAPIUrl)
      .then((res) => {
        if (res.status === 200) {
          setMatch(true);
        }
      })
      .catch((err) => {
        setMatch(false);
      });
  }, [sourcifyAPIUrl]);

  const url = match ? sourcifyRepoUrl : null;

  return (
    <button
      className="flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-default disabled:opacity-50 disabled:text-gray-500"
      disabled={!match}
    >
      <img src={logo} width={16} className="mr-1" alt="Sourcify Logo" />
      <a href={url} target="_blank" rel="noreferrer">
        {match ? "View on Sourcify" : "Not found on Sourcify"}
      </a>
    </button>
  );
};

export default SourcifyButton;
