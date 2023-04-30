import {ConversationPopulated, MessagePopulated} from '../../../backend/src/util/types'

export interface CreateUsernameData {
    createUsername: {
        success: boolean
        error: string
    }
}

export interface CreateUsernameVariables {
    username: string;
}

export interface SearchUsersInputs {
    username: string;
}

export interface SearchUsersData {
    searchUsers: Array<SearchedUser>
}

export interface SearchedUser {
    id: string;
    username: string;
}

/**
 * Conversations
 */
export interface ConversationsData {
    conversations: Array<ConversationPopulated>;
}

export interface CreateConversationData {
    createConversation: {
        conversationId: string;
    }
}

export interface CreateConversationInput {
    participantIds: Array<string>
}

export interface ConversationUpdatedData {
    conversationUpdated: {
        // conversation: Omit<ConversationPopulated, 'latestMessage'> & {
        //     latestMessage: MessagePopulated
        // };
        conversation: ConversationPopulated
    },
}
/**
 * Messages
 */
export interface MessagesData {
    messages: Array<MessagePopulated>
}

export interface MessagesVariables {
    conversationId: string;
}

export interface MessageSubscriptionData {
    subscriptionData: {
        data: {
            messageSent: MessagePopulated;
        }
    }
}