import React from 'react';
import {Video} from "../../types";
import VideoCard from "./VideoCard";
import NoResults from "./NoResults";

interface IFeedProps {
    videos: Video[]
}

const Feed: React.FC<IFeedProps> = ({videos}) => {
    return (
        <div className='overflow-x-hidden'>
            {videos.length ? (videos.map((video: Video) => (<VideoCard post={video} key={video._id}/>))
            ) : (
                <div className='my-60'>
                    <NoResults text={'No Videos'}/>
                </div>
            )}
        </div>
    );
};

export default Feed;