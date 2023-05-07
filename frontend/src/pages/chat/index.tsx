import React, {ReactElement} from "react";
import {Flex} from "@chakra-ui/react";
import MainLayout from "../../pages/layout/MainLayout";
import {NextPageWithLayout} from "../_app";
import FeedWrapper from "../../components/chat/feed/FeedWrapper";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

const Chat: NextPageWithLayout = () => {
    const {data: session} = useSession();

    return (
        <>
            <Flex height="90vh">
                <div className='hidden lg:flex w-[100%]'>
                    <FeedWrapper session={session as Session}/>
                </div>
            </Flex>
        </>
    );
};

Chat.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}


export default Chat;
