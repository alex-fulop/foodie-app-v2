import {Flex, Stack} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {useQuery} from "@apollo/client";
import {MessagesData, MessageSubscriptionData, MessagesVariables} from "../../../../util/types";
import MessageOperations from '../../../../graphql/operations/message';
import toast from "react-hot-toast";
import SkeletonLoader from "../../../common/SkeletonLoader";
import MessageItem from "./MessageItem";

interface MessagesProps {
    userId: string;
    conversationId: string;
    senderImage: string
}

const Messages: React.FC<MessagesProps> = ({userId, conversationId, senderImage}) => {

    const {
        data,
        loading,
        error,
        subscribeToMore
    } = useQuery<MessagesData, MessagesVariables>(MessageOperations.Query.messages, {
        variables: {
            conversationId,
        },
        onError: ({message}) => {
            toast.error(message);
        },
        onCompleted: () => {
        }
    });

    const subscribeToMoreMessages = (conversationId: string) => {
        subscribeToMore({
            document: MessageOperations.Subscription.messageSent,
            variables: {
                conversationId
            },
            updateQuery: (prev, {subscriptionData}: MessageSubscriptionData) => {
                if (!subscriptionData) return prev;

                const newMessage = subscriptionData.data.messageSent;

                return Object.assign({}, prev, {
                    messages: newMessage.sender.id === userId ? prev.messages : [newMessage, ...prev.messages],
                });
            },
        });
    };

    useEffect(() => {
        subscribeToMoreMessages(conversationId);
    }, [conversationId])

    if (error) {
        return null;
    }

    console.log('aci x2', data?.messages)

    return (
        <Flex direction="column" justify="flex-end" overflow="hidden">
            {loading && (
                <Stack spacing={4} px={4}>
                    <SkeletonLoader count={4} height="60px" width="100%"/>
                </Stack>
            )}
            {data?.messages && (
                <Flex flexDirection="column-reverse" overflowY="scroll" height="100%">
                    {data.messages.map((message) => (
                        <MessageItem
                            key={message.id}
                            message={message}
                            sentByMe={message.sender.id === userId}
                            senderImage={message.sender.image}
                        />
                    ))}
                </Flex>
            )}
        </Flex>
    );
};

export default Messages;