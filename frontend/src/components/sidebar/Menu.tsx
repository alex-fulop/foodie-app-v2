import Link from "next/link";
import React, {useState} from "react";
import {AiFillHome, AiFillMessage} from "react-icons/ai";

const links = [
    {
        icon: <AiFillHome/>,
        label: "For you",
        page: "",
    },
    {
        icon: <AiFillMessage/>,
        label: "Messages",
        page: "chat",
    },
];

const activeLink =
    "flex items-center gap-3 hover:bg-gray-700 p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#F51997] rounded";
const inactiveLink =
    "flex items-center gap-3 hover:bg-gray-700 p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#F58EC8] rounded";

const Menu = () => {
    const [activeLinkIndex, setActiveLinkIndex] = useState(0);

    const renderedLinks = links.map((link, index) => {
        const linkClass = index === activeLinkIndex ? activeLink : inactiveLink;

        return (
            <Link href={`/${link.page}`}
                  key={index}
                  className={linkClass}
                  onClick={() => setActiveLinkIndex(index)}
            >
                <p className="text-2xl">{link.icon}</p>
                <span className="text-xl hidden xl:block">{link.label}</span>
            </Link>
        );
    });

    return (
        <div className="xl:border-b-2 xl:pb-4">{renderedLinks}</div>
    );
};

export default Menu;
