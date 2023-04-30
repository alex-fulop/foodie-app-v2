import Link from "next/link";
import React, {useState} from "react";
import Image from "next/image";
import {GoogleLogin} from "@react-oauth/google";
import {createOrGetUser} from "../util";

import useAuthStore from "../store/authStore";
import {AiOutlineLogout, BiSearch, IoMdAdd} from "react-icons/all";
import {useRouter} from "next/router";
import {signIn, signOut, useSession} from "next-auth/react";
import {Button} from "@chakra-ui/react";

const Navbar = () => {
    const {data} = useSession();
    const [searchValue, setSearchValue] = useState("");

    const router = useRouter();

    const handleSearch = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (searchValue) {
            router.push(`/search/${searchValue}`);
        }
    };

    return (
        <div className="w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4">
            <Link href="/">
                <div className="w-[100px] md:w-[129px] md:h-[30px] h-[38px]">
                    <Image
                        className="cursor-pointer"
                        src="/foodie-logo.svg"
                        alt="foodie logo"
                        width="120"
                        height="30"
                    />
                </div>
            </Link>

            <div className="relative hidden md:block">
                <form
                    className="absolute md:static top-10 -left-20 bg-white"
                    onSubmit={handleSearch}
                >
                    <input
                        className="bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full md:top-0"
                        type="text"
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                        }}
                        placeholder="Search accounts and videos"
                    />
                    <button
                        className="absolute md:right-5 right-6 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400"
                        onClick={handleSearch}
                    >
                        <BiSearch/>
                    </button>
                </form>
            </div>

            {data?.user ? (
                <div className="flex gap-5 md:gap-10">
                    <Link href="/upload">
                        <button
                            className="border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2 rounded-full">
                            <IoMdAdd className="text-xl"/> {` `}
                            <span className="hidden md:block">Upload</span>
                        </button>
                    </Link>
                    {data?.user?.image && (
                        <Link href="/">
                            <Image
                                width={40}
                                height={40}
                                className="rounded-full cursor-pointer"
                                src={data?.user?.image}
                                alt="profile photo"
                            />
                        </Link>
                    )}
                    <Button onClick={() => signOut()}>
                        <AiOutlineLogout color="red" fontSize={21}/>
                    </Button>
                </div>
            ) : (
                <Button onClick={() => signIn('google')}>Sign In</Button>
            )}
        </div>
    );
};

export default Navbar;
