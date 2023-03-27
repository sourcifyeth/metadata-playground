import React, { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsonLang from "react-syntax-highlighter/dist/esm/languages/prism/json";
import codeStyle from "react-syntax-highlighter/dist/esm/styles/prism/prism";
import solidityLang from "react-syntax-highlighter/dist/esm/languages/prism/solidity";

const CollapsibleCode = ({ children, language }) => {
  switch (language) {
    case "json":
      SyntaxHighlighter.registerLanguage("json", jsonLang);
      break;
    case "solidity":
      SyntaxHighlighter.registerLanguage("solidity", solidityLang);
      break;
    default:
      break;
  }

  const [codeCollapsed, setCodeCollapsed] = useState(true);
  const toggleCollapse = () => setCodeCollapsed((current) => !current);

  return (
    <div
      className="w-full flex flex-col overflow-hidden transition-all ease-out duration-500"
      style={codeCollapsed ? { maxHeight: "15rem" } : { maxHeight: "9999rem" }}
    >
      <div className="my-1">
        <button
          className="mt-1 py-2 px-4 bg-transparent hover:bg-ceruleanBlue-100 hover:text-gray-50  text-ceruleanBlue-100 transition ease-in duration-200 text-center text-base font-semibold focus:outline-none rounded-lg disabled:opacity-50 disabled:cursor-default"
          onClick={toggleCollapse}
        >
          {codeCollapsed ? "Expand" : "Collapse"}
        </button>
        <button
          className="mt-1 py-2 px-4 bg-transparent hover:bg-ceruleanBlue-100 hover:text-gray-50  text-ceruleanBlue-100 transition ease-in duration-200 text-center text-base font-semibold focus:outline-none rounded-lg disabled:opacity-50 disabled:cursor-default"
          onClick={() => navigator.clipboard.writeText(children)}
        >
          Copy to Clipboard
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={codeStyle}
        className="text-left w-full"
        customStyle={{ fontSize: "0.8rem" }}
      >
        {children}
      </SyntaxHighlighter>
      <button
        className="mt-1 py-2 w-full px-4 bg-transparent hover:bg-ceruleanBlue-100 hover:text-gray-50  text-ceruleanBlue-100 transition ease-in duration-200 text-center text-base font-semibold focus:outline-none rounded-lg disabled:opacity-50 disabled:cursor-default"
        onClick={toggleCollapse}
      >
        {codeCollapsed ? "Expand" : "Collapse"}
      </button>
    </div>
  );
};

export default CollapsibleCode;
