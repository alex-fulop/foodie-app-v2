import React from 'react';
import {Video} from "../../types";
import VideoCard from "./VideoCard";
import NoResults from "./NoResults";

interface IFeedProps {
    videos: Video[]
}

const Feed: React.FC<IFeedProps> = ({videos}) => {
    return (
        <div className="flex flex-col gap-10 h-[100vh] mt-2 videos flex-1">
            <div className="flex flex-col gap-10 overflow-auto videos h-full">
                <div className='feed-container'>
                    {videos.length ? (videos.map((video: Video, idx: number) => (
                            <VideoCard post={video} key={video._id} idx={idx}/>))
                    ) : (
                        <div className='my-60'>
                            <NoResults text={'No Videos'}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feed;