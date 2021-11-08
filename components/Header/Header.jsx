import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex py-3 justify-center bg-white">
      <Link href="/">
        <a>
          <h1 className="text-xl font-bold">Bus Routes</h1>
        </a>
      </Link>
      <div />
    </header>
  );
};

export default Header;
