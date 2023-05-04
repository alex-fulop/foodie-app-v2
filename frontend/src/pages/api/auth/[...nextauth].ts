import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {PrismaClient} from "@prisma/client";
import axios from "axios";
import {useSession} from "next-auth/react";

const prisma = new PrismaClient();

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXT_PUBLIC_SECRET,
    callbacks: {
        async session({session, token, user}) {
            return {...session, user: {...session.user, ...user}};
        }
    }
});