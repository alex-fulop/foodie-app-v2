import React, {useEffect, useRef, useState} from 'react';
import {Video} from "../../types";
import {NextPage} from "next";
import Link from "next/link";
import Image from 'next/image';
import {BsFillPauseFill, BsFillPlayFill, GoVerified, HiVolumeOff, HiVolumeUp} from "react-icons/all";

interface IProps {
    post: Video;
    idx: number
}

const VideoCard: NextPage<IProps> = ({post, idx}) => {
    const [isHover, setIsHover] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

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
        if (videoRef?.current) {
            videoRef.current.muted = isVideoMuted;
        }
    }, [isVideoMuted]);


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

                    {isHover && (
                        <div
                            className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-4 flex gap-10 lg:justify-between w-[100px] md:w-[50px] p-3 video-controls{isHover && 'visible'}">
                            {isPlaying ? (
                                <button onClick={onVideoPress}>
                                    <BsFillPauseFill className="text-black text-2xl lg:text-4xl"/>
                                </button>
                            ) : (
                                <button onClick={onVideoPress}>
                                    <BsFillPlayFill className="text-black text-2xl lg:text-4xl"/>
                                </button>
                            )}
                            {isVideoMuted ? (
                                <button onClick={() => setIsVideoMuted(false)}>
                                    <HiVolumeOff className="text-black text-2xl lg:text-4xl"/>
                                </button>
                            ) : (
                                <button onClick={() => setIsVideoMuted(true)}>
                                    <HiVolumeUp className="text-black text-2xl lg:text-4xl"/>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VideoCard;