import http from "http";
import express from 'express'
import {makeExecutableSchema} from '@graphql-tools/schema'
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import * as dotenv from 'dotenv'
import {GraphQLContext, SubscriptionContext} from "./util/types";
import {getSession} from "next-auth/react";
import {PrismaClient} from '@prisma/client';
import {useServer} from "graphql-ws/lib/use/ws";
import {WebSocketServer} from 'ws';
import {PubSub} from "graphql-subscriptions";
import {json} from "body-parser";
import cors from 'cors';
import {ApolloServer} from "@apollo/server";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import {Session} from "next-auth";
import {expressMiddleware} from "@apollo/server/express4";

async function main() {
    dotenv.config();
    const app = express();
    const httpServer = http.createServer(app);

    // Creating the WebSocket server
    const wsServer = new WebSocketServer({
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if app.use
        // serves expressMiddleware at a different path
        path: '/graphql/subscriptions',
    });

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    });


    // Hand in the schema we just created and have the
    // WebSocketServer start listening.
    const serverCleanup = useServer({
        schema, context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
            if (ctx.connectionParams && ctx.connectionParams.session) {
                const {session} = ctx.connectionParams;

                return {session, prisma, pubsub};
            }

            return {session: null, prisma, pubsub};
        }
    }, wsServer);

    /**
     * Context parameters
     */
    const prisma = new PrismaClient();
    const pubsub = new PubSub();

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),

            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await server.start();

    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    }

    app.use(
        "/graphql",
        cors<cors.CorsRequest>(corsOptions),
        json(),
        expressMiddleware(server, {
            context: async ({req}): Promise<GraphQLContext> => {
                const session = await getSession({req});

                return {session: session as Session, prisma, pubsub};
            },
        })
    );

    const PORT = 4000;

    await new Promise<void>((resolve) => {
        httpServer.listen({port: PORT}, resolve)
    });

    console.log(`Server ready at http://localhost:${PORT}/graphql`);
}

main().catch((err) => console.log(err))