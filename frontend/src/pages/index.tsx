import axios from "axios";
import {Video} from "../../types";
import React from "react";
import {BASE_URL} from "../util";
import {getSession, useSession} from "next-auth/react";
import {NextPageContext} from "next";
import {Box} from "@chakra-ui/react";
import Auth from "../components/auth/Auth";
import Chat from "../components/chat";

interface IProps {
    videos: Video[]
}

const Home = ({videos}: IProps) => {
    const {data: session} = useSession();

    const reloadSession = () => {
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
    };

    return (
        <Box>
            {session?.user?.username ?
                <Chat session={session} videos={videos}/> :
                <Auth session={session} reloadSession={reloadSession}/>}
        </Box>
    );
}

export const getServerSideProps = async (context: NextPageContext, query: string) => {
    let response;

    if (query) response = await axios.get(`${BASE_URL}/api/discover/${query}`);
    else response = await axios.get(`${BASE_URL}/api/post`);
    const session = await getSession(context)
    return {
        props: {
            videos: response.data,
            session: session
        }
    }
};

export default Home