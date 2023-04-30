import "../../styles/globals.css";
import type {AppProps} from "next/app";
import React, {useEffect, useState} from "react";
import {SessionProvider} from "next-auth/react";
import {ChakraProvider} from "@chakra-ui/react";
import {theme} from "../chakra/theme";
import {ApolloProvider} from "@apollo/client";
import {client} from "../graphql/apollo-client";
import {Toaster} from "react-hot-toast";

const MyApp = ({Component, pageProps: {session, ...pageProps}}: AppProps) => {
    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => {
        setIsSSR(false);
    }, []);

    if (isSSR) return null;

    return (
        <ApolloProvider client={client}>
            <SessionProvider session={session}>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                    <Toaster />
                </ChakraProvider>
            </SessionProvider>
        </ApolloProvider>
    );
};

export default MyApp;
