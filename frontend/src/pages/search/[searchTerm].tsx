import React, {Key, ReactElement, useState} from 'react';
import axios from "axios";
import {IUser, Video} from "../../../types";
import NoResults from "../../components/NoResults";
import {useRouter} from "next/router";
import VideoCard from "../../components/VideoCard";
import useAuthStore from "../../store/authStore";
import Link from "next/link";
import Image from "next/image";
import {GoVerified} from "react-icons/all";
import MainLayout from "../layout/MainLayout";
import {BASE_URL} from "../../util/constants";

const Search = ({videos}: { videos: Video[] }) => {
    const [isAccounts, setIsAccounts] = useState(false);

    const router = useRouter();

    const accounts = isAccounts ? 'border-b-2 border-white' : 'text-neutral-400';
    const isVideos = !isAccounts ? 'border-b-2 border-white' : 'text-neutral-400';

    const {searchTerm}: any = router.query;
    const {allUsers} = useAuthStore();

    const searchedAccounts = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className='w-full'>
            <div className="flex gap-10 mb-10 mt-10 border-b-2 w-full">
                <p className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`}
                   onClick={() => setIsAccounts(true)}>Accounts</p>
                <p className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`}
                   onClick={() => setIsAccounts(false)}>Videos</p>
            </div>

            {isAccounts ?
                <div className="md:mt-16">
                    {searchedAccounts.length > 0 ? searchedAccounts.map((user: IUser, idx: number) => (
                            <Link href={`/profile/${user._id}`} key={idx}>
                                <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2'>
                                    <div className="w-8 h-8">
                                        <Image
                                            src={user.image}
                                            width={50}
                                            height={50}
                                            className='rounded-full'
                                            alt='user profile'
                                        />
                                    </div>
                                    <div className='hidden xl:block'>
                                        <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                                            {user.userName.replaceAll(' ', '')}
                                            <GoVerified className='text-blue-400'/>
                                        </p>
                                        <p className='text-neutral-400 text-xs capitalize'>{user.userName}</p>
                                    </div>
                                </div>
                            </Link>
                        )) :
                        <NoResults text={`No video results for ${searchTerm}`}/>}
                </div> : <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start'>
                    {videos.length ?
                        videos.map((video: Video, idx: number) => <VideoCard post={video} key={idx as Key} idx={idx}/>) :
                        <NoResults text={`No video results for ${searchTerm}`}/>}
                </div>}
        </div>
    );
};

Search.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

export const getServerSideProps = async ({params: {searchTerm}}: {
    params: { searchTerm: string }
}) => {
    const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);

    return {
        props: {videos: res.data}
    }
}

export default Search;
