import { GithubIcon } from "../assets/icons";

const Header = () => {
  return (
    <header className="flex flex-row items-center justify-between md:px-10 px-4">
      <a
        href="https://sourcify.dev"
        target="_blank"
        className="py-4 flex flex-row items-center"
        rel="noreferrer"
      >
        <img src="/logo.svg" className="h-16 p-2 rounded-full" alt="logo" />
        <span className="vt323 text-3xl text-gray-700 ml-2">sourcify</span>
      </a>
      <div className="header__social-icons flex flex-row">
        <a
          href="https://github.com/sourcifyeth/metadata-playground"
          target="_blank"
          className="ml-2 text-gray-600"
          rel="noopener noreferrer"
        >
          <GithubIcon />
        </a>
      </div>
    </header>
  );
};

export default Header;
