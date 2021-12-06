export default function Explainer(props) {
  const h1Class = "text-2xl font-medium text-center text-gray-900";

  const h2Class = "text-lg text-center text-gray-900";

  return (
    <div {...props}>
      <div>
        <h1 className={h1Class}>What is Metadata?</h1>
        <div className="mt-2">
          From{" "}
          <a
            className="underline text-ceruleanBlue-100"
            href="https://docs.soliditylang.org/en/latest/metadata.html"
            target="_blank"
          >
            docs
          </a>
          : "The Solidity compiler automatically generates a JSON file, the
          contract metadata, that contains information about the compiled
          contract. You can use this file to query the compiler version, the
          sources used, the ABI and NatSpec documentation to more safely
          interact with the contract and verify its source code.""
        </div>
        <h2 className={h2Class}>The Metadata file looks like this:</h2>
      </div>
    </div>
  );
}
