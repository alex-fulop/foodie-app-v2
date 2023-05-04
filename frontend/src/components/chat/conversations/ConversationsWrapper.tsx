import React, {useEffect} from "react";
import {Session} from "next-auth";
import {Box, Stack} from "@chakra-ui/react";
import ConversationList from "./ConversationList";
import {gql, useMutation, useQuery, useSubscription} from "@apollo/client";
import ConversationOperations from '../../../graphql/operations/conversation'
import {ConversationsData, ConversationUpdatedData} from "../../../util/types";
import {ConversationPopulated, ParticipantPopulated} from '../../../../../backend/src/util/types';
import {useRouter} from "next/router";
import SkeletonLoader from "../../common/SkeletonLoader";

interface ConversationsWrapperProps {
    session: Session
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({session}) => {
    const router = useRouter();
    const {query: {conversationId}} = router;
    const {user: {id: userId}} = session;
    const {
        data: conversationsData,
        loading: conversationsLoading,
        error: conversationsError,
        subscribeToMore
    } = useQuery<ConversationsData>(ConversationOperations.Queries.conversations);

    const [markConversationAsRead] = useMutation<
        { markConversationAsRead: boolean },
        { userId: string; conversationId: string }
    >(ConversationOperations.Mutations.markConversationAsRead);

    useSubscription<ConversationUpdatedData, any>(
        ConversationOperations.Subscriptions.conversationUpdated,
        {
            onData: ({client, data}) => {
                const {data: subscriptionData} = data;

                if (!subscriptionData) return;

                const {conversationUpdated: {conversation: updatedConversation}} = subscriptionData;

                const currentlyViewingConversation = updatedConversation.id === conversationId;

                if (currentlyViewingConversation) {
                    onViewConversation(conversationId as string, false);
                }
            }
        }
    );

    const onViewConversation = async (
        conversationId: string,
        hasSeenLatestMessage: boolean
    ) => {
        await router.push({query: {conversationId}});

        /**
         * Only mark as read if conversation is unread
         */
        if (hasSeenLatestMessage) return;

        try {
            await markConversationAsRead({
                variables: {
                    userId,
                    conversationId,
                },
                optimisticResponse: {
                    markConversationAsRead: true,
                },
                update: (cache) => {
                    /**
                     * Get conversation participants
                     * from cache
                     */
                    const participantsFragment = cache.readFragment<{
                        participants: Array<ParticipantPopulated>;
                    }>({
                        id: `Conversation:${conversationId}`,
                        fragment: gql`
                            fragment Participants on Conversation {
                                participants {
                                    user {
                                        id
                                        username
                                    }
                                    hasSeenLatestMessage
                                }
                            }
                        `,
                    });

                    if (!participantsFragment) return;

                    /**
                     * Create copy to
                     * allow mutation
                     */
                    const participants = [...participantsFragment.participants];

                    const userParticipantIdx = participants.findIndex(
                        (p) => p.user.id === userId
                    );

                    /**
                     * Should always be found
                     * but just in case
                     */
                    if (userParticipantIdx === -1) return;

                    const userParticipant = participants[userParticipantIdx];

                    /**
                     * Update user to show the latest
                     * message as read
                     */
                    participants[userParticipantIdx] = {
                        ...userParticipant,
                        hasSeenLatestMessage: true,
                    };

                    /**
                     * Update cache
                     */
                    cache.writeFragment({
                        id: `Conversation:${conversationId}`,
                        fragment: gql`
                            fragment UpdatedParticipants on Conversation {
                                participants
                            }
                        `,
                        data: {
                            participants,
                        },
                    });
                },
            });
        } catch (error) {
            console.log("onViewConversation error", error);
        }
    };
    const subscribeToNewConversations = () => {
        subscribeToMore({
            document: ConversationOperations.Subscriptions.conversationCreated,
            updateQuery: (prev, {subscriptionData}: { subscriptionData: { data: { conversationCreated: ConversationPopulated } } }) => {
                if (!subscriptionData.data) return prev;

                const newConversation = subscriptionData.data.conversationCreated;

                return Object.assign({}, prev, {
                    conversations: [newConversation, ...prev.conversations]
                });
            }
        });
    };

    /**
     * Execute subscription on mount
     */
    useEffect(() => {
        subscribeToNewConversations();
    }, []);

    return (
        <Box width={{base: '100%'}} bg='blackAlpha.50' flexDirection="column" gap={4} py={6} px={3}>
            {conversationsLoading ? (
                <Stack spacing={4} px={4}>
                    <SkeletonLoader count={7} height='80px'/>
                </Stack>
            ) : (
                <ConversationList session={session}
                                  conversations={conversationsData?.conversations || []}
                                  onViewConversation={onViewConversation}/>
            )}
        </Box>
    );
};

export default ConversationsWrapper;