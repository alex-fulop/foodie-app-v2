import React, {Dispatch, SetStateAction} from 'react';
import NoResults from "./NoResults";
import {IUser} from "../../types";
import Link from "next/link";
import Image from "next/image";
import {GoVerified} from "react-icons/all";
import {useSession} from "next-auth/react";

interface IProps {
    comment: string;
    comments: IComment[];
    isPostingComment: Boolean;
    setComment: Dispatch<SetStateAction<string>>;
    addComment: (e: React.FormEvent) => void;
    allUsers: []
}

interface IComment {
    comment: string;
    length?: number;
    _key: string;
    postedBy: { _key: string, _ref: string, _id: string};
}

const Comments = ({comment, comments, isPostingComment, setComment, addComment, allUsers}: IProps) => {
    const {data: session} = useSession();

    return (
        <div className='shadow-2xl pt-4 px-10 bg-neutral-900 lg:pb-0 pb-[100px]'>
            <div className='overflow-auto lg:h-[475px]'>
                {comments?.length ? (comments.map((comment, idx) => (
                        <div key={idx} className={comment.postedBy._ref}>
                            {allUsers.map((user: IUser) => ((user._id === comment.postedBy._id || user._id === comment.postedBy._ref) && (
                                    <div className="p-2 items-center" key={idx}>
                                        <Link href={`/profile/${user._id}`}>
                                            <div className='flex items-start gap-3'>
                                                <div className="w-8 h-8">
                                                    <Image
                                                        src={user.image}
                                                        width={34}
                                                        height={34}
                                                        className='rounded-full'
                                                        alt='user profile'
                                                        layout='responsive'
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
                                        <div>
                                            <p>{comment.comment}</p>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    ))
                ) : (
                    <NoResults text='No comments yet!'/>
                )}
            </div>
            {session?.user && (
                <div className='absolute bottom-0 left-0 pb-6 px-2 md:px-10'>
                    <form className='flex gap-4' onSubmit={addComment}>
                        <input
                            className='bg-neutral-700 px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Add comment...'
                        />
                        <button className='text-md text-neutral-400 hover:text-[#F51997]' onClick={addComment}>
                            {isPostingComment ? 'Commenting...' : 'Comment'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Comments;
