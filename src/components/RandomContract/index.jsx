//us-east1-trends-298419.cloudfunctions.net/randomContract
import { useEffect, useState } from "react";
import dice from "../../assets/dice.png";

const RandomContract = ({ handleChainAndContractChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [contracts, setContracts] = useState();
  useEffect(() => {
    fetch("https://us-east1-trends-298419.cloudfunctions.net/randomContract")
      .then((response) => response.json())
      .then((randomContracts) => {
        console.log(randomContracts);
        setContracts(randomContracts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "Couldn't fetch random contracts, falling back to default ones"
        );
        const defaultContracts = require("./defaultContracts.json");
        setContracts(defaultContracts);
        setIsLoading(false);
      });
  }, []);

  const handleShuffle = (e) => {
    e.preventDefault();
    const length = contracts.length;
    const rand = Math.floor(Math.random() * length);
    const chosenContract = contracts[rand];
    console.log(rand);
    console.log(chosenContract);
    handleChainAndContractChange(
      chosenContract.chainId,
      chosenContract.address
    );
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="flex flex-row justify-center items-center text-sm cursor-default"
      >
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-5 w-5 mr-2" />
        Loading Random Contracts
      </button>
    );
  } else {
    return (
      <button
        onClick={handleShuffle}
        className="flex flex-row justify-center items-center text-sm hover:font-medium hover:underline transform active:translate-y-1 py-2"
      >
        <img src={dice} className="mr-1" width="20px" />
        Random Contract
      </button>
    );
  }
};

export default RandomContract;
