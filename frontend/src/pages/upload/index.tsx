import React, {ReactElement, useState} from 'react';
import {FaCloudUploadAlt} from "react-icons/all";
import {SanityAssetDocument} from "@sanity/client";
import axios from "axios";
import {useRouter} from "next/router";
import toast from "react-hot-toast";
import {topics} from "../../util/constants";
import {client} from "../../util/client";
import {BASE_URL} from "../../util";
import MainLayout from "../layout/MainLayout";
import Link from "next/link";
import {useSession} from "next-auth/react";

const Upload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [wrongFileType, setWrongFileType] = useState(false);
    const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>();
    const [recipe, setRecipe] = useState('');
    const [category, setCategory] = useState(topics[0].name);
    const [savingPost, setSavingPost] = useState(false);

    const {data: session} = useSession()
    const router = useRouter();

    console.log("OKAY", session?.user)

    const uploadVideo = async (e: any) => {
        const selectedFile = e.target.files[0];
        const fileTypes = ['video/mp4', 'video/webm', 'video/ogg'];

        if (fileTypes.includes(selectedFile.type)) {
            client.assets.upload('file', selectedFile, {
                contentType: selectedFile.type,
                filename: selectedFile.name
            })
                .then((data) => {
                    setVideoAsset(data);
                    setIsLoading(false);
                })
        } else {
            setIsLoading(false);
            setWrongFileType(true)
        }
    }

    const handlePost = async () => {
        if (recipe && videoAsset?._id && category) {
            setSavingPost(true);

            console.log(session?.user)

            const document = {
                _type: 'post',
                caption: recipe,
                video: {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: videoAsset?._id,
                    }
                },
                userId: session?.user.id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: session?.user.id
                },
                topic: category
            }

            await toast.promise(Promise.all(
                [axios.post(`${BASE_URL}/api/post`, document), router.push('/')]), {
                loading: "Uploading video",
                success: "Video uploaded successfully",
                error: "Failed to upload video",
            })
        }
    }

    return (
        <div
            className="flex w-full h-full absolute left-0 top-[68px] mb-10 pt-10 lg:pt-20 bg-neutral-900 justify-center">
            <div
                className="bg-blend-darken rounded-lg xl:h-[80vh] w-[60%] flex gap-6 flex-wrap justify-between items-center p-14 pt-6">
                <div>
                    <div>
                        <p className="text-2xl font-bold">Upload Video</p>
                        <p className="text-md text-neutral-400 mt-1">Post a video to your account</p>
                    </div>
                    <div className="border-dashed rounded-xl border-4 flex flex-col justify-center
                     items-center outline-none mt-10 w-[260px] h-[460px] cursor-pointer hover:border-red-300 hover:bg-neutral-600">
                        {isLoading ? (
                            <p>Uploading...</p>
                        ) : (
                            <div>
                                {videoAsset ? (
                                    <div>
                                        <video className="rounded-xl h-[450px] bg-black" src={videoAsset.url} loop
                                               controls></video>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer">
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="font-bold text-xl">
                                                    <FaCloudUploadAlt className="text-neutral-300 text-6xl"/>
                                                </p>
                                                <p className="text-xl font-semibold">
                                                    Upload Video
                                                </p>
                                            </div>
                                            <p className="text-neutral-400 text-center mt-10 text-sm leading-10">
                                                MP4 or WebM or ogg <br/>
                                                720x1280 or higher <br/>
                                                Up to 10 minutes <br/>
                                                Less than 2GB
                                            </p>
                                            <p className="bg-[#F51997] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none">Select
                                                File</p>
                                        </div>
                                        <input className="w-0 h-0" type="file" name="upload-video"
                                               onChange={uploadVideo}/>
                                    </label>
                                )}
                            </div>
                        )}
                    </div>
                    {wrongFileType && (
                        <p className="text-center text-xl text-red-400 font-semibold mt-4 w-[250px]">
                            Please select a video file
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-3 pb-10">
                    <label className="text-md font-medium">Recipe</label>
                    <textarea className="rounded outline-none text-md border-2 p-2 resize-none bg-black"
                              placeholder='Write your recipe here..'
                              rows={3} value={recipe} onChange={(e) => {
                        setRecipe(e.target.value)
                    }}></textarea>
                    <label className="text-md font-medium">Choose a category</label>
                    <select
                        className="outline-none border-2 text-md capitalize lg:p-4 p-2 rounded cursor-pointer bg-black"
                        onChange={(e) => {
                            setCategory(e.target.value)
                        }}>
                        {topics.map((topic) => (
                            <option
                                className="outline-none capitalize bg-black text-neutral-300 text-md p-2 hover:bg-slate-300"
                                key={topic.name} value={topic.name}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-6 mt-10">
                        <Link href='/'>
                            <button
                                className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
                                type="button">
                                Discard
                            </button>
                        </Link>
                        <button
                            className="bg-[#F51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
                            onClick={handlePost} type="button">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

Upload.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

export default Upload;
