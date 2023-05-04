import "../../styles/globals.css";
import type {AppProps} from "next/app";
import React, {ReactElement, ReactNode, useEffect, useState} from "react";
import {SessionProvider} from "next-auth/react";
import {ChakraProvider} from "@chakra-ui/react";
import {theme} from "../chakra/theme";
import {ApolloProvider} from "@apollo/client";
import {client} from "../graphql/apollo-client";
import {Toaster} from "react-hot-toast";
import {NextPage} from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const MyApp = ({Component, pageProps: {session, ...pageProps}}: AppPropsWithLayout) => {
    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => {
        setIsSSR(false);
    }, []);

    if (isSSR) return null;

    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <ApolloProvider client={client}>
            <SessionProvider session={session}>
                <ChakraProvider theme={theme}>
                    {getLayout(
                        <>
                            <Component {...pageProps} />
                            <Toaster/>
                        </>
                    )}
                </ChakraProvider>
            </SessionProvider>
        </ApolloProvider>
    );
};

export default MyApp;
