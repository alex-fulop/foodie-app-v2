import {gql, useMutation, useQuery, useSubscription} from "@apollo/client";
import {Box, Stack} from "@chakra-ui/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import toast from "react-hot-toast";
import {ParticipantPopulated} from "../../../../../backend/src/util/types";
import ConversationOperations from "../../../graphql/operations/conversations";
import MessageOperations from "../../../graphql/operations/messages";
import {
    ConversationCreatedSubscriptionData,
    ConversationDeletedData,
    ConversationsData,
    ConversationUpdatedData,
    MessagesData,
} from "../../../util/types";
import SkeletonLoader from "../../common/SkeletonLoader";
import ConversationList from "./ConversationList";

interface ConversationsProps {
    session: Session;
}

const ConversationsWrapper: React.FC<ConversationsProps> = ({session}) => {
    const router = useRouter();
    const {conversationId} = router.query;
    const {
        user: {id: userId},
    } = session;

    /**
     * Queries
     */
    const {
        data: conversationsData,
        loading: conversationsLoading,
        error: conversationsError,
        subscribeToMore,
    } = useQuery<ConversationsData, null>(
        ConversationOperations.Queries.conversations,
        {
            onError: ({message}) => {
                toast.error(message);
            },
        }
    );

    /**
     * Mutations
     */
    const [markConversationAsRead] = useMutation<
        { markConversationAsRead: true },
        { userId: string; conversationId: string }
    >(ConversationOperations.Mutations.markConversationAsRead);

    /**
     * Subscriptions
     */
    useSubscription<ConversationUpdatedData, null>(
        ConversationOperations.Subscriptions.conversationUpdated,
        {
            onData: async ({client, data}) => {
                const {data: subscriptionData} = data;

                if (!subscriptionData) return;

                const {
                    conversationUpdated: {
                        conversation: updatedConversation,
                        addedUserIds,
                        removedUserIds,
                    },
                } = subscriptionData;

                const currentlyViewingConversation = updatedConversation.id === conversationId;

                if (currentlyViewingConversation) {
                    await onViewConversation(conversationId as string, false);
                    return;
                }

                const {id: updatedConversationId, latestMessage} = updatedConversation;

                /**
                 * Check if user is being removed
                 */
                if (removedUserIds && removedUserIds.length) {
                    const isBeingRemoved = removedUserIds.find((id) => id === userId);

                    if (isBeingRemoved) {
                        const conversationsData = client.readQuery<ConversationsData>({
                            query: ConversationOperations.Queries.conversations,
                        });

                        if (!conversationsData) return;

                        client.writeQuery<ConversationsData>({
                            query: ConversationOperations.Queries.conversations,
                            data: {
                                conversations: conversationsData.conversations.filter(
                                    (c) => c.id !== updatedConversationId
                                ),
                            },
                        });

                        if (conversationId === updatedConversationId) {
                            router.replace(
                                typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                                    ? process.env.NEXT_PUBLIC_BASE_URL
                                    : ""
                            );
                        }

                        /**
                         * Early return - no more updates required
                         */
                        return;
                    }
                }

                /**
                 * Check if user is being added to conversation
                 */
                if (addedUserIds && addedUserIds.length) {
                    const isBeingAdded = addedUserIds.find((id) => id === userId);

                    if (isBeingAdded) {
                        const conversationsData = client.readQuery<ConversationsData>({
                            query: ConversationOperations.Queries.conversations,
                        });

                        if (!conversationsData) return;

                        client.writeQuery<ConversationsData>({
                            query: ConversationOperations.Queries.conversations,
                            data: {
                                conversations: [
                                    ...(conversationsData.conversations || []),
                                    updatedConversation,
                                ],
                            },
                        });
                    }
                }

                const existing = client.readQuery<MessagesData>({
                    query: MessageOperations.Query.messages,
                    variables: {conversationId: updatedConversationId},
                });

                if (!existing) return;

                /**
                 * Check if lastest message is already present
                 * in the message query
                 */
                const hasLatestMessage = existing.messages.find(
                    (m) => m.id === latestMessage.id
                );

                /**
                 * Update query as re-fetch won't happen if you
                 * view a conversation you've already viewed due
                 * to caching
                 */
                if (!hasLatestMessage) {
                    client.writeQuery<MessagesData>({
                        query: MessageOperations.Query.messages,
                        variables: {conversationId: updatedConversationId},
                        data: {
                            ...existing,
                            messages: [latestMessage, ...existing.messages],
                        },
                    });
                }
            },
        }
    );

    useSubscription<ConversationDeletedData, null>(
        ConversationOperations.Subscriptions.conversationDeleted,
        {
            onData: ({client, data}) => {
                const {data: subscriptionData} = data;

                if (!subscriptionData) return;

                const existing = client.readQuery<ConversationsData>({
                    query: ConversationOperations.Queries.conversations,
                });

                if (!existing) return;

                const {conversations} = existing;
                const {
                    conversationDeleted: {id: deletedConversationId},
                } = subscriptionData;

                client.writeQuery<ConversationsData>({
                    query: ConversationOperations.Queries.conversations,
                    data: {
                        conversations: conversations.filter(
                            (conversation) => conversation.id !== deletedConversationId
                        ),
                    },
                });
            },
        }
    );

    const onViewConversation = async (
        conversationId: string,
        hasSeenLatestMessage: boolean
    ) => {
        /**
         * 1. Push the conversationId to the router query params
         */
        await router.push({query: {conversationId}});

        /**
         * 2. Mark the conversation as read
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
                     * Get conversation participants from cache
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
                                        image
                                    }
                                    hasSeenLatestMessage
                                }
                            }
                        `,
                    });

                    if (!participantsFragment) return;

                    const participants = [...participantsFragment.participants];

                    const userParticipantIdx = participants.findIndex(
                        (p) => p.user.id === userId
                    );

                    if (userParticipantIdx === -1) return;

                    const userParticipant = participants[userParticipantIdx];

                    /**
                     * Update participant to show latest message as read
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
                            fragment UpdatedParticipant on Conversation {
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
            updateQuery: (
                prev,
                {subscriptionData}: ConversationCreatedSubscriptionData
            ) => {
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

    if (conversationsError) {
        toast.error("There was an error fetching conversations");
        return null;
    }

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