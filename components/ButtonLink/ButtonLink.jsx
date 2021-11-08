import Link from "next/link";

export const ButtonLink = ({ href, label }) => {
  return (
    <Link href={href}>
      <a className="bg-white py-4 px-8 my-2 text-3xl shadow-sm hover:shadow-md hover:text-blue-600">
        {label}
      </a>
    </Link>
  );
};

export default ButtonLink;
