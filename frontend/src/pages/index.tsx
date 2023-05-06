import axios from "axios";
import {Video} from "../../types";
import React from "react";
import {useSession} from "next-auth/react";
import MainLayout from "./layout/MainLayout";
import Feed from "../components/Feed";
import {Box} from "@chakra-ui/react";
import Auth from "../components/auth";
import {BASE_URL} from "../util/constants";

interface IProps {
    videos: Video[]
}

const Home = ({videos}: IProps) => {
    const {data: session} = useSession();

    const reloadSession = () => {
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
    };

    console.log('session', session?.user);

    return (
        <Box>
            {session && session?.user?.username ? (
                <MainLayout>
                    <Feed videos={videos}/>
                </MainLayout>
            ) : (
                <Box>
                    <Auth session={session} reloadSession={reloadSession}/>
                </Box>
            )}
        </Box>
    );
}

export const getServerSideProps = async ({query: {topic}}: {
    query: { topic: string };
}) => {
    let response = await axios.get(`${BASE_URL}/api/post`);

    if (topic) {
        response = await axios.get(`${BASE_URL}/api/discover/${topic}`);
    }

    return {
        props: {videos: response.data},
    };
};

export default Home