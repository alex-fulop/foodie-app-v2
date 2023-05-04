import axios from "axios";
import {Video} from "../../types";
import React, {ReactElement} from "react";
import {BASE_URL} from "../util";
import {getSession, useSession} from "next-auth/react";
import {NextPageContext} from "next";
import {Box} from "@chakra-ui/react";
import MainLayout from "./layout/MainLayout";
import Feed from "../components/Feed";
import {useRouter} from "next/router";

interface IProps {
    videos: Video[]
}

const Home = ({videos}: IProps) => {
    const {data: session} = useSession();
    const router = useRouter();

    if (session?.user?.username === undefined)
        router.push('/auth')

    return (
        <Box>
            <Feed videos={videos}/>
        </Box>
    );
}

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

export const getServerSideProps = async (context: NextPageContext, query: string) => {
    let response;
    const session = await getSession(context)

    if (query) response = await axios.get(`${BASE_URL}/api/discover/${query}`);
    else response = await axios.get(`${BASE_URL}/api/post`);

    return {
        props: {
            videos: response.data,
            session: session
        }
    }
};

export default Home