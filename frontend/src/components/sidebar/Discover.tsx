import React from "react";
import Link from "next/link";

import {topics} from "../../util/constants";
import {useRouter} from "next/router";

const Discover = () => {
    const router = useRouter();
    const {topic} = router.query;

    const borderColors = [
        "border-[#FF0000]",
        "border-[#FF8C00]",
        "border-[#F7FF00]",
        "border-[#2AFF00]",
        "border-[#00EAFF]",
        "border-[#0062FF]",
        "border-[#9000FF]",
        "border-[#FF00FF]",
    ];

    const textColors = [
        "text-[#FF0000]",
        "text-[#FF8C00]",
        "text-[#F7FF00]",
        "text-[#2AFF00]",
        "text-[#00EAFF]",
        "text-[#0062FF]",
        "text-[#9000FF]",
        "text-[#FF00FF]",
    ];
    const getClassStyle = (item: { name: string }, idx: number) => {
        if (topic === item.name)
            return `border-2 hover:outline-none ${textColors[idx]} ${borderColors[idx]} px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center cursor-pointer`;
        return "border-2 hover:outline-none hover:border-neutral-300 hover:text-neutral-300 px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center cursor-pointer text-white";
    };

    return (
        <div className="xl:border-b-2 pb-6">
            <p className="text-neutral-500 font-semibold m-3 mt-4 hidden xl:block">
                Popular Topics
            </p>
            <div className="flex gap-3 flex-wrap justify-center mt-2">
                {topics.map((item, idx) => (
                    <Link href={`/?topic=${item.name}`} key={item.name}>
                        <div className={getClassStyle(item, idx)}>
              <span className="font-medium text-md capitalize">
                <span>{item.icon}</span>
                <span className="hidden xl:inline-block">
                  {item.name}
                </span>
              </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Discover;
