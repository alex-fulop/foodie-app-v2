import axios from "axios";
import {Video} from "../../types";
import React, {ReactElement} from "react";
import {BASE_URL} from "../util";
import {useSession} from "next-auth/react";
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