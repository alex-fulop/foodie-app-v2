import axios from "axios";
import {Video} from "../../types";
import React from "react";
import {getSession, useSession} from "next-auth/react";
import MainLayout from "./layout/MainLayout";
import Feed from "../components/Feed";
import {Box} from "@chakra-ui/react";
import Auth from "../components/auth";
import {BASE_URL} from "../util/constants";
import {GetServerSideProps} from "next";
import {Session} from "next-auth";

interface IProps {
    videos: Video[]
    session: any
}

const Home = ({videos}: IProps) => {
    const {data: session} = useSession();

    const reloadSession = () => {
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
    };

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

export const getServerSideProps: GetServerSideProps<IProps> = async ({query: {topic}, req}) => {
    const session = await getSession({req});

    let response = await axios.get(`${BASE_URL}/api/post`);

    if (topic) {
        response = await axios.get(`${BASE_URL}/api/discover/${topic}`);
    }

    return {
        props: {
            videos: response.data,
            session: session ? session : null
        }
    };
};

export default Home