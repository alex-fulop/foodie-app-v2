import axios from "axios";
import {Video} from "../../../types";
import Image from "next/image";
import {GoVerified} from "react-icons/all";
import React, {Key, useEffect, useState} from "react";
import VideoCard from "../../components/VideoCard";
import NoResults from "../../components/NoResults";
import MainLayout from "../layout/MainLayout";
import {BASE_URL} from "../../util/constants";
import Sidebar from "../../components/sidebar/Sidebar";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

const Profile = ({data}: any) => {
    const [showUserVideos, setShowUserVideos] = useState(true);
    const [videosList, setVideosList] = useState<Video[]>([]);

    const {user, userVideos, userLikedVideos} = data;
    const videos = showUserVideos ? 'border-b-2 border-white' : 'text-neutral-400';
    const liked = !showUserVideos ? 'border-b-2 border-white' : 'text-neutral-400';
    const {data: session} = useSession();

    useEffect(() => {
        if (showUserVideos) {
            setVideosList(userVideos);
        } else {
            setVideosList(userLikedVideos)
        }
    }, [showUserVideos, userLikedVideos, userVideos]);

    return (
        <MainLayout>
            <>
                <Sidebar session={session as Session}/>
                <div className='mt-2 flex flex-col flex-grow'>
                    <div className="flex gap-6 md:gap-10 mb-4 mt-2 w-full">
                        <div className="w-16 h-16 md:w-32 md:h-32">
                            <Image
                                src={user.image}
                                width={120}
                                height={120}
                                className='rounded-full'
                                alt='user profile'
                                layout='responsive'
                            />
                        </div>

                        <div className='flex flex-col justify-center'>
                            <p className='md:text-2xl tracking-wider flex gap-1 items-center items-center justify-center text-md font-bold text-primary lowercase'>
                                {user.userName.replaceAll(' ', '')}
                                <GoVerified className='text-blue-400'/>
                            </p>
                            <p className='text-neutral-400 text-xs md:text-xl capitalize'>
                                {user.userName}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-10 mb-10 mt-10 border-b-2 bg-dark w-full">
                        <p className={`text-xl font-semibold cursor-pointer mt-2 ${videos}`}
                           onClick={() => setShowUserVideos(true)}>Videos</p>
                        <p className={`text-xl font-semibold cursor-pointer mt-2 ${liked}`}
                           onClick={() => setShowUserVideos(false)}>Liked</p>
                    </div>

                    <div className='flex gap-6 flex-wrap md:justify-start'>
                        {videosList.length > 0 ? (
                            videosList.map((post: Video, idx: Number) => (
                                <VideoCard postDetails={post} key={idx as Key}/>
                            ))
                        ) : <NoResults text={`No ${showUserVideos ? '' : 'Liked'} Videos Yet`}/>}
                    </div>
                </div>
            </>
        </MainLayout>

    );
}

export const getServerSideProps = async ({params: {id}}: {
    params: { id: string }
}) => {
    const res = await axios.get(`${BASE_URL}/api/profile/${id}`);

    return {
        props: {data: res.data}
    }
}

export default Profile;