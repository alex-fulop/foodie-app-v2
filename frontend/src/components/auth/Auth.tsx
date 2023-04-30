import React, {useState} from "react";
import {Session} from "next-auth";
import {Button, Center, Image, Input, Stack, Text} from "@chakra-ui/react";
import {signIn} from "next-auth/react";
import {useMutation} from "@apollo/client";

import UserOperation from '../../graphql/operations/user'
import {CreateUsernameData, CreateUsernameVariables} from "../../util/types";
import toast from "react-hot-toast";

interface IAuthProps {
    session: Session | null;
    reloadSession: () => void
}

const Auth: React.FunctionComponent<IAuthProps> = ({session, reloadSession}) => {
    const [username, setUsername] = useState("");
    const [createUsername, {loading, error}] =
        useMutation<CreateUsernameData, CreateUsernameVariables>(UserOperation.Mutations.createUsername);

    const onSubmit = async () => {
        if (!username) return;

        try {
            /*
            * createUsername mutation to send our username to the GraphQL API
            */
            const { data } = await createUsername({variables: {username}});

            if (!data?.createUsername) {
                throw new Error();
            }

            if (data.createUsername.error) {
                const {createUsername: {error}} = data;
                throw new Error(error);
            }

            toast.success('User info successfully completed! 🍣')

            /**
             * Reload session to obtain new user data
             */
            reloadSession();
        } catch (error: any) {
            toast.error(error?.message);
            console.log('onSubmit error', error);
        }
    }

    return (
        <Center height='100vh'>
            <Stack align='center' spacing={8}>
                {session ? (
                    <>
                        <Text fontSize='3xl'>Create a Username</Text>
                        <Input placeholder='Enter a username' value={username}
                               onChange={(event) => setUsername(event.target.value)}/>
                        <Button width='100%' onClick={onSubmit} isLoading={loading}>Save</Button>
                    </>
                ) : (
                    <>
                        <Image src='/foodie-logo.svg' height='60px'/>
                        <Button onClick={() => signIn('google')}
                                leftIcon={<Image src='/google-logo.png' height='20px'/>}>Continue with Google</Button>
                    </>
                )}
            </Stack>
        </Center>
    );
}

export default Auth;