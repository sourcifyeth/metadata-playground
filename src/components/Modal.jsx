/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";
import BlockExplorerButton from "./BlockExplorerButton";
import MetadataHash from "./MetadataHash";
import SourcifyButton from "./SourcifyButton";

const highlightStyle = " bg-blue-900 text-gray-50";
const cborHighlightStyle = " bg-yellow-800 text-gray-50";

const SolcVersion = ({ hexversion }) => {
  const rawHex = hexversion.slice(2); // remove 0x
  const rawHexFields = rawHex.match(/.{1,2}/g); // split into two chars
  const decimalFields = rawHexFields
    .map((rawHex) => "0x" + rawHex)
    .map((prefixedHex) => Number(prefixedHex));
  const version = decimalFields.join(".");
  return version;
};
const ByteCodeInput = ({ children, cborByteLength }) => {
  // autoscroll to dummy bottom element
  const bottom = useRef();
  useEffect(() => bottom.current.scrollIntoView({ behavior: "smooth" }));
  // If cborByteLength === 0, don't highlight.
  const cborStrLength = 2 * cborByteLength;
  const unhighlighted = cborByteLength
    ? children.slice(0, -cborStrLength - 4)
    : children;
  const highlighted = cborByteLength
    ? children.slice(-cborStrLength - 4, -4)
    : null;
  const cborBytes = cborByteLength ? children.slice(-4) : null;
  return (
    <div
      className="text-gray-700 overflow-y-auto break-all max-h-48 md:max-h-56 font-mono"
      for="name"
    >
      <span className="">{unhighlighted}</span>
      <span className={"" + highlightStyle}>{highlighted}</span>
      <span className={"" + cborHighlightStyle}>{cborBytes}</span>
      <div style={{ float: "left", clear: "both" }} ref={bottom}></div>
    </div>
  );
};

// from: https://tailwindui.com/components/application-ui/overlays/modals
export default function Modal({
  isOpen,
  onClose,
  byteCode,
  decodedCbor,
  metadataHash,
  address,
  chainObject,
}) {
  const cancelButtonRef = useRef(null);
  if (!chainObject || !byteCode) {
    return null;
  }
  const { chainId: chain, name: networkName } = chainObject;
  const cborByteLength = decodedCbor
    ? parseInt(Number("0x" + byteCode.slice(-4)), 10)
    : 0;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto md:mx-24"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="">
                  <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left white">
                    {address ? (
                      <div>
                        <Dialog.Title
                          as="h3"
                          className="text-center text-lg leading-6 font-medium text-gray-900"
                        >
                          Contract {address} on {networkName}
                        </Dialog.Title>
                        <div className="flex justify-center align-middle my-2">
                          <SourcifyButton chain={chain} address={address} />
                          <BlockExplorerButton
                            chain={chain}
                            address={address}
                          />
                        </div>
                      </div>
                    ) : null}
                    <p className="text-lg font-bold text-gray-900">
                      Contract Bytecode
                    </p>
                    <ByteCodeInput cborByteLength={cborByteLength}>
                      {byteCode}
                    </ByteCodeInput>
                    {/* Decoded */}
                    <div className="mt-4">
                      <p className="text-lg font-bold text-gray-900">
                        CBOR decoding
                      </p>

                      {decodedCbor ? (
                        <div>
                          <span>CBOR length:</span>{" "}
                          <pre className={"inline-block " + cborHighlightStyle}>
                            {cborByteLength} Bytes
                          </pre>
                          <span className="text-xs underline ml-2 text-gray-700">
                            <a
                              href={`https://cbor.me/?bytes=${byteCode.slice(
                                -(2 * cborByteLength) - 4,
                                -4
                              )}`}
                              target="_blank"
                            >
                              See on CBOR Playground
                            </a>
                          </span>
                          <pre className={"overflow-x-auto" + highlightStyle}>
                            {JSON.stringify(decodedCbor, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div> No CBOR code to decode </div>
                      )}
                    </div>
                    {/* solc version */}
                    {decodedCbor?.solc && (
                      <div className="mt-4">
                        <p className="text-lg font-bold text-gray-900">
                          Solidity compiler version (decoded)
                        </p>
                        <SolcVersion hexversion={decodedCbor.solc} />
                      </div>
                    )}
                    {/* IPFS Link */}
                    <div className="mt-4">
                      <p className="text-lg font-bold text-gray-900">
                        Metadata Hash (decoded)
                      </p>
                      <MetadataHash metadataHash={metadataHash} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                  ref={cancelButtonRef}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
