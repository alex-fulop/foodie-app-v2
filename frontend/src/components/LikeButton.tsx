import React, {useEffect, useState} from 'react';
import {MdFavorite} from "react-icons/all";
import {useSession} from "next-auth/react";

interface IProps {
    handleLike: () => void;
    handleDislike: () => void;
    likes: any[];
    showLikes: boolean;
}

const LikeButton = ({likes, handleLike, handleDislike, showLikes}: IProps) => {
    const [alreadyLiked, setAlreadyLiked] = useState(false);
    const {data: session} = useSession();
    const filterLikes = likes?.filter((item) => item._ref === session?.user.id);

    useEffect(() => {
        if (filterLikes?.length > 0) {
            setAlreadyLiked(true);
        } else {
            setAlreadyLiked(false);
        }
    }, [filterLikes, likes]);

    return (
        <div className='flex gap-6 mb-5'>
            <div className='flex justify-center items-center'>
                {alreadyLiked ? (
                    <div className='bg-neutral-700 rounded-full p-2 md:p-4 text-[#F51997] cursor-pointer'
                         onClick={handleDislike}>
                        <MdFavorite className='text-lg md:text-4xl'/>
                    </div>
                ) : (
                    <div className='bg-neutral-700 rounded-full p-2 md:p-4 cursor-pointer' onClick={handleLike}>
                        <MdFavorite className='text-lg md:text-4xl'/>
                    </div>
                )}
                {showLikes && <p className='text-2xl ml-2 font-bold'>{likes?.length || 0}</p>}
            </div>
        </div>
    );
};

export default LikeButton;
