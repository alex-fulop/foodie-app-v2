import {Prisma, PrismaClient} from "@prisma/client";
import {ISODateString, Session} from "next-auth";

import 'next-auth'
import {conversationPopulated, participantPopulated} from "../graphql/resolvers/conversations";
import {Context} from "graphql-ws/lib/server";
import {PubSub} from "graphql-subscriptions";
import {messagePopulated} from "../graphql/resolvers/messages";

/**
 * Server Configuration
 */
export interface GraphQLContext {
    session: Session | null;
    prisma: PrismaClient;
    pubsub: PubSub;
}

declare module 'next-auth' {
    export interface Session {
        user?: User;
        expires: ISODateString;
    }
}

export interface SubscriptionContext extends Context {
    connectionParams: {
        session?: Session
    }
}

/**
 * Users
 */
interface User {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
    image: string;
    name: string;
}

export interface CreateUsernameResponse {
    success?: boolean;
    error?: string;
}

/**
 * Conversations
 */
export type ConversationPopulated = Prisma.ConversationGetPayload<{
    include: typeof conversationPopulated
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
    include: typeof participantPopulated
}>;

/**
 * Messages
 */
export interface ConversationUpdatedSubscriptionPayload {
    conversationUpdated: {
        conversation: ConversationPopulated;
    }
}

export interface ConversationDeletedSubscriptionPayload {
    conversationDeleted: ConversationPopulated;
}

export interface SendMessageArguments {
    id: string;
    conversationId: string;
    senderId: string;
    body: string;
}

export interface MessageSentSubscriptionPayload {
    messageSent: MessagePopulated;
}

export interface ConversationCreatedSubscriptionPayload {
    conversationCreated: ConversationPopulated;
}

export interface ConversationUpdatedSubscriptionData {
    conversationUpdated: {
        conversation: ConversationPopulated;
        addedUserIds: Array<string>;
        removedUserIds: Array<string>;
    };
}

export type MessagePopulated = Prisma.MessageGetPayload<{ include: typeof messagePopulated }>