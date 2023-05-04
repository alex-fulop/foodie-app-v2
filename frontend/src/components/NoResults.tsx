import React from 'react';
import {BiCommentX, MdOutlineVideocamOff} from "react-icons/all";

interface IProps {
    text: string;
}

const NoResults = ({text}: IProps) => {
    return (
        <div className='flex flex-col justify-center items-center h-full w-full'>
            <p className='text-8xl text-neutral-500'>
                {text === 'No comments yet!' ? <BiCommentX/> : <MdOutlineVideocamOff/>}
            </p>
            <p className='text-2xl text-center text-neutral-500'>{text}</p>
        </div>
    );
};

export default NoResults;