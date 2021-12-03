const Connecting = ({ connected }) => {
  if (connected === "connecting") {
    return (
      <div className="flex items-center justify-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-5 w-5"></div>
        <div className="ml-1 text-sm" style={{ paddingTop: "2px" }}>
          Connecting
        </div>
      </div>
    );
  }

  if (connected === "connected") {
    return (
      <div className="flex items-center justify-center">
        <span className="text-green-500 text-xl">●</span>
        <span className="ml-1 text-sm" style={{ paddingTop: "2px" }}>
          Connected
        </span>
      </div>
    );
  }

  if (connected === "not connected") {
    return (
      <div className="flex items-center justify-center">
        <span className="text-red-500 text-xl">●</span>
        <span className="ml-1 text-sm" style={{ paddingTop: "2px" }}>
          Not Connected
        </span>
      </div>
    );
  }

  return null;
};

export default Connecting;
