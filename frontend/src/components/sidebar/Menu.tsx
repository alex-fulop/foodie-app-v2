import Link from "next/link";
import React, { useState } from "react";
import { AiFillHome, AiFillMessage } from "react-icons/ai";

const links = [
  {
    icon: <AiFillHome />,
    label: "For you",
    page: "home",
  },
  {
    icon: <AiFillMessage />,
    label: "Messages",
    page: "messages",
  },
];

const activeLink =
  "flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#F51997] rounded";
const inactiveLink =
  "flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#F58EC8] rounded";

interface IProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Menu = ({ setCurrentPage }: IProps) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(0);

  const renderedLinks = links.map((link, index) => {
    const linkClass = index === activeLinkIndex ? activeLink : inactiveLink;

    return (
      <div
        key={index}
        className={linkClass}
        onClick={() => {
          setActiveLinkIndex(index);
          setCurrentPage(link.page);
        }}
      >
        <p className="text-2xl">{link.icon}</p>
        <span className="text-xl hidden xl:block">{link.label}</span>
      </div>
    );
  });

  return (
    <div className="xl:border-b-2 border-gray-200 xl:pb-4">{renderedLinks}</div>
  );
};

export default Menu;
