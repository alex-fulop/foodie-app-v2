import Link from "next/link";
import React, {useState} from "react";
import Image from "next/image";
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
        <div className="w-full flex justify-between items-center shadow-2xl py-2 px-4 z-10">
            <div className="w-[100px] md:w-[129px] md:h-[30px] h-[38px]">
                <Link href='/'>
                    <Image
                        className="cursor-pointer"
                        src="/foodie-logo.svg"
                        alt="foodie logo"
                        width="120"
                        height="30"
                    />
                </Link>
            </div>

            <div className="relative hidden md:block">
                <form
                    className="absolute md:static top-10 left-20"
                    onSubmit={handleSearch}
                >
                    <input
                        className="bg-transparent p-3 md:text-md font-medium border-2 hover:outline-none hover:border-2 hover:border-neutral-300 focus:outline-none focus:border-2 focus:border-neutral-300 w-[300px] md:w-[350px] rounded-full md:top-0"
                        type="text"
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                        }}
                        placeholder="Search accounts and videos"
                    />
                    <button
                        className="absolute md:right-5 right-6 top-4 border-l-2 pl-4 text-2xl text-neutral-500 hover:text-neutral-300"
                        onClick={handleSearch}
                    >
                        <BiSearch/>
                    </button>
                </form>
            </div>

            {data?.user ? (
                <div className="flex gap-5 md:gap-10">
                    <Link href='/upload'>
                        <button
                            className="border-2 bg-transparent h-full rounded-full px-2 md:px-4 hover:outline-none hover:border-2 hover:border-neutral-300 hover:text-neutral-300 text-md flex text-neutral-500 items-center gap-2 rounded-full">
                            <IoMdAdd className="text-xl"/>
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
                    <Button bg='transparent' rounded='full' onClick={() => signOut()}>
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
