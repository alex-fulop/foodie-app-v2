import {Flex} from "@chakra-ui/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import React from "react";
import Messages from "./messages/Messages";
import MessagesHeader from "./messages/Header";
import MessageInput from "./Input";
import NoConversationSelected from "./NoConversationSelected";

interface FeedWrapperProps {
    session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({session}) => {
    const router = useRouter();

    const {conversationId} = router.query;

    return (
        <div className="flex flex-col flex-1 mt-2">
            <Flex
                display={{base: conversationId ? "flex" : "none", md: "flex"}}
                direction="column"
                width="100%"
                height='92vh'
            >
                {conversationId && typeof conversationId === "string" ? (
                    <>
                        <Flex
                            direction="column"
                            justify="space-between"
                            overflow="hidden"
                            flexGrow={1}
                        >
                            <MessagesHeader
                                userId={session.user.id}
                                conversationId={conversationId}
                            />
                            <Messages
                                userId={session.user.id}
                                conversationId={conversationId}
                            />
                        </Flex>
                        <MessageInput session={session} conversationId={conversationId}/>
                    </>
                ) : (
                    <NoConversationSelected/>
                )}
            </Flex>
        </div>
    );
};
export default FeedWrapper;