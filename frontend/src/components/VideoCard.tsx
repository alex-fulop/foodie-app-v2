import React, {useEffect, useRef, useState} from 'react';
import {Video} from "../../types";
import {NextPage} from "next";
import Link from "next/link";
import Image from 'next/image';
import {BsFillPauseFill, BsFillPlayFill, GoVerified, HiVolumeOff, HiVolumeUp} from "react-icons/all";
import axios from "axios";
import {BASE_URL} from "../util/constants";
import {useSession} from "next-auth/react";
import {getAllUsers} from "../util/functions";
import LikeButton from "./LikeButton";

interface IProps {
    postDetails: Video;
}

const VideoCard: NextPage<IProps> = ({postDetails}) => {
    const [post, setPost] = useState(postDetails);
    const [isHover, setIsHover] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const {data: session} = useSession();

    const onVideoPress = () => {
        if (isPlaying) {
            videoRef?.current?.pause();
            setIsPlaying(false)
        } else {
            videoRef?.current?.play();
            setIsPlaying(true)
        }
    }

    useEffect(() => {
        if (post && videoRef?.current) {
            videoRef.current.muted = isVideoMuted;
        }
    }, [post, isVideoMuted]);

    const handleLike = async (like: boolean) => {
        if (!session?.user) {
            throw new Error("Not authorized");
        }

        const {data} = await axios.put(`${BASE_URL}/api/like`, {
            userId: session?.user.id,
            postId: post._id,
            like
        });

        setPost({...post, likes: data.likes});
    }


    return (
        <div className="flex flex-col pb-6">
            <div>
                <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
                    <div className="md:w-16 md:h-16 w-10 h-10">
                        <Link href={`/profile/${post.postedBy._id}`}>
                            <>
                                <Image width={62} height={62} className="rounded-full" src={post.postedBy.image}
                                       alt="profile photo" layout="responsive"></Image>
                            </>
                        </Link>
                    </div>
                    <div>
                        <Link href={`/profile/${post.postedBy._id}`}>
                            <div className='flex items-center gap-2'>
                                <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                                    {post.postedBy.userName}
                                    {` `}
                                    <GoVerified className='text-blue-400 text-md'/>
                                </p>
                                <p className='capitalize font-medium text-xs text-neutral-500 hidden md:block'>
                                    {post.postedBy.userName}
                                </p>
                            </div>
                        </Link>
                        <p className='text-md text-neutral-400 font-thin'>{post.caption}</p>
                    </div>
                </div>
            </div>

            <div className="lg:ml-20 flex gap-4 relative">
                <div
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    className='rounded-3xl m-auto'>
                    <Link href={`/detail/${post._id}`}>
                        <video
                            loop
                            ref={videoRef}
                            className="lg:w-[600px] lg:h-[530px] h-[300px] md:h-[600px] rounded-2xl cursor-pointer bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 border border-neutral-900"
                            style={{backdropFilter: 'blur(20px)'}}
                            src={post.video.asset.url}
                        >
                        </video>
                    </Link>

                    <div
                        className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-11 flex flex-col gap-6 lg:justify-between p-3 video-controls{isHover && 'visible'}">
                        {isVideoMuted ? (
                            <button className={`fade-in ${isHover ? 'visible' : 'not-visible'}`}
                                    onClick={() => setIsVideoMuted(false)}>
                                <div
                                    className='bg-neutral-700 rounded-full p-2 md:p-4 text-[#F51997] cursor-pointer'>
                                    <HiVolumeOff className="text-white text-2xl lg:text-4xl"/>
                                </div>
                            </button>
                        ) : (
                            <button className={`fade-in ${isHover ? 'visible' : 'not-visible'}`}
                                    onClick={() => setIsVideoMuted(true)}>
                                <div
                                    className='bg-neutral-700 rounded-full p-2 md:p-4 text-[#F51997] cursor-pointer'>
                                    <HiVolumeUp className="text-white text-2xl lg:text-4xl"/>
                                </div>
                            </button>
                        )}
                        {isPlaying ? (
                            <button className={`fade-in ${isHover ? 'visible' : 'not-visible'}`} onClick={onVideoPress}>
                                <div
                                    className='bg-neutral-700 rounded-full p-2 md:p-4 text-[#F51997] cursor-pointer'>
                                    <BsFillPauseFill className="text-white text-2xl lg:text-4xl fade-in visible"/>
                                </div>
                            </button>
                        ) : (
                            <button className={`fade-in ${isHover ? 'visible' : 'not-visible'}`} onClick={onVideoPress}>
                                <div
                                    className='bg-neutral-700 rounded-full p-2 md:p-4 text-[#F51997] cursor-pointer'>
                                    <BsFillPlayFill className="text-white text-2xl lg:text-4xl"/>
                                </div>
                            </button>
                        )}
                        {session?.user && (
                            <div className={`fade-in ${isHover ? 'visible' : 'not-visible'}`}>
                                <LikeButton likes={post.likes}
                                            showLikes={false}
                                            handleLike={() => handleLike(true)}
                                            handleDislike={() => handleLike(false)}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;