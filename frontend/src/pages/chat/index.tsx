import React from "react";
import {NextPageWithLayout} from "../_app";
import ChatWrapper from "../../components/chat/feed/FeedWrapper";
import {getSession, useSession} from "next-auth/react";
import {Session} from "next-auth";
import MainLayout from "../layout/MainLayout";
import Sidebar from "../../components/sidebar/Sidebar";
import {GetServerSideProps} from "next";

interface IChatProps {
    session: any
}

const Chat: NextPageWithLayout = () => {
    const {data: session} = useSession();

    return (
        <MainLayout>
            <>
                <Sidebar session={session as Session}/>
                <ChatWrapper session={session as Session}/>
            </>
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps<IChatProps> = async ({req}) => {
    const session = await getSession({req});

    return {
        props: {
            session: session ? session : null
        }
    };
}


export default Chat;
