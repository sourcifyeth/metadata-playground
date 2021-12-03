import { useEffect, useState } from "react";
const RandomContractInfo = ({ chainId, address }) => {
  const [contractInfo, setContractInfo] = useState();
  useEffect(() => {
    if (!chainId || !address) return;
    fetch(
      `https://raw.githubusercontent.com/ethereum-lists/contracts/main/contracts/${chainId}/${address}.json`
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setContractInfo(json);
      })
      .catch((err) => {
        setContractInfo(null);
        console.log(
          `Couldn't find contract ${address} on chainId ${chainId} in Github ethereum-lists/contracts`
        );
      });
  }, [chainId, address]);

  if (!contractInfo) return null;

  return (
    <div className="text-right mb-1 text-xs md:text-sm text-gray-600">
      <div>
        <b>Contract name:</b> {contractInfo.name || "N/A"}
      </div>
      <div>
        <b>Project:</b> {contractInfo.project || "N/A"}
      </div>
      <div>
        <b>Source:</b> {contractInfo.source || "N/A"}
      </div>
    </div>
  );
};

export default RandomContractInfo;
