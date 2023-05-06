import React from "react";
import Link from "next/link";

import {borderColors, textColors, topics} from "../../util/constants";
import { useRouter } from "next/router";

const Discover = () => {
  const router = useRouter();
  const { topic } = router.query;

  const getClassStyle = (item: { name: string }, idx: number) => {
    if (topic === item.name)
      return `border-2 hover:bg-neutral-700 ${borderColors[idx]} px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center cursor-pointer ${textColors[idx]}`;
    return "border-2 hover:bg-neutral-700 px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center cursor-pointer text-white";
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
