import React from 'react'
import {SearchedUser} from "../../../../util/types";
import {Flex, Stack, Text} from "@chakra-ui/react";
import {VscClose} from "react-icons/all";

interface IParticipantsProps {
    participants: Array<SearchedUser>;
    removeParticipant: (userId: string) => void
}

const Participants: React.FC<IParticipantsProps> = ({participants, removeParticipant}) => {
    return (
        <Flex mt={8} gap='10px' flexWrap='wrap'>
            {participants.map(participant => (
                <Stack key={participant.id} direction='row' align='center' bg='whiteAlpha.200' borderRadius={4} p={2}>
                    <Text>{participant.username}</Text>
                    <VscClose size={20} cursor='pointer' onClick={() => removeParticipant(participant.id)}/>
                </Stack>
            ))}
        </Flex>
    )
}

export default Participants;
