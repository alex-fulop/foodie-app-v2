import {useMutation} from "@apollo/client";
import {Box, Text} from "@chakra-ui/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import React, {useContext, useState} from "react";
import toast from "react-hot-toast";
import {ConversationPopulated, ParticipantPopulated,} from "../../../../../backend/src/util/types";
import {IModalContext, ModalContext} from "../../../context/ModalContext";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./modal/ConversationModal";
import ConversationOperations from '../../../graphql/operations/conversations'

interface ConversationListProps {
    session: Session;
    conversations: Array<ConversationPopulated>;
    onViewConversation: (conversationId: string, hasSeenLatestMessage: boolean) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({session, conversations, onViewConversation}) => {
    const {user: {id: userId}} = session;

    const {modalOpen, openModal, closeModal} = useContext<IModalContext>(ModalContext);
    const [editingConversation, setEditingConversation] =
        useState<ConversationPopulated | null>(null);

    const router = useRouter();
    const {conversationId} = router.query;

    /**
     * Mutations
     */
    const [updateParticipants] = useMutation<
        { updateParticipants: boolean },
        { conversationId: string; participantIds: Array<string> }
    >(ConversationOperations.Mutations.updateParticipants);

    const [deleteConversation] = useMutation<
        { deleteConversation: boolean },
        { conversationId: string }
    >(ConversationOperations.Mutations.deleteConversation);

    const onLeaveConversation = async (conversation: ConversationPopulated) => {
        const participantIds = conversation.participants
            .filter((p: ParticipantPopulated) => p.user.id !== userId)
            .map((p: ParticipantPopulated) => p.user.id);

        try {
            const {data, errors} = await updateParticipants({
                variables: {
                    conversationId: conversation.id,
                    participantIds,
                },
            });

            if (!data || errors) {
                throw new Error("Failed to update participants");
            }
        } catch (error: any) {
            console.log("onUpdateConversation error", error);
            toast.error(error?.message);
        }
    };

    const onDeleteConversation = async (conversationId: string) => {
        try {
            await toast.promise(
                deleteConversation({
                    variables: {
                        conversationId,
                    },
                    update: () => {
                        router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
                    },
                }),
                {
                    loading: "Deleting conversation",
                    success: "Conversation deleted",
                    error: "Failed to delete conversation",
                }
            );
        } catch (error) {
            console.log("onDeleteConversation error", error);
        }
    };

    const onEditConversation = (conversation: ConversationPopulated) => {
        setEditingConversation(conversation);
        openModal();
    };

    const getUserParticipantObject = (conversation: ConversationPopulated) => {
        return conversation.participants.find(
            (p: ParticipantPopulated) => p.user.id === session.user.id
        ) as ParticipantPopulated;
    };

    const toggleClose = () => {
        setEditingConversation(null);
        closeModal();
    };

    const sortedConversations = [...conversations].sort(
        (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
    );

    return (
        <Box width="100%" overflow="hidden">
            <Box
                py={2}
                px={4}
                mb={4}
                mt={2}
                bg="blackAlpha.300"
                borderRadius={4}
                cursor="pointer"
                onClick={openModal}
            >
                <Text color="whiteAlpha.800" fontWeight={500}>
                    Find or start a conversation
                </Text>
            </Box>
            <ConversationModal
                isOpen={modalOpen}
                onClose={toggleClose}
                session={session}
                conversations={conversations}
                editingConversation={editingConversation}
                onViewConversation={onViewConversation}
                getUserParticipantObject={getUserParticipantObject}
            />
            {sortedConversations.map((conversation) => {
                const participant = conversation.participants.find((p: ParticipantPopulated) => p.user.id === userId);

                return (
                    <ConversationItem
                        key={conversation.id}
                        userId={session.user.id}
                        conversation={conversation}
                        hasSeenLatestMessage={participant?.hasSeenLatestMessage}
                        selectedConversationId={conversationId as string}
                        onClick={() => onViewConversation(conversation.id, participant?.hasSeenLatestMessage)}
                        onEditConversation={() => onEditConversation(conversation)}
                        onDeleteConversation={onDeleteConversation}
                        onLeaveConversation={onLeaveConversation}
                    />
                );
            })}

        </Box>
    );
};

export default ConversationList;