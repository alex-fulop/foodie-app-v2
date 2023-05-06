import {ParticipantPopulated} from '../../../backend/src/util/types';
import axios from "axios";
import {BASE_URL} from "./constants";
import {randomGradients} from "./constants";

export const formatUsernames = (
    participants: Array<ParticipantPopulated>,
    myUserId: string
): string => {
    const usernames = participants
        .filter((participant) => participant.user.id != myUserId)
        .map((participant) => participant.user.username);

    return usernames.join(', ');
}

export const getProfilePicture = (
    participants: Array<ParticipantPopulated>,
    myUserId: string
): string => {
    const profilePictures = participants
        .filter((participant) => participant.user.id != myUserId)
        .map((participant) => participant.user.image);

    return profilePictures[0];
}


export const getAllUsers = async () => {
    const response = await axios.get(`${BASE_URL}/api/users`);
    return response.data;
}

export const getAllCommentsFromPost = async (id: String) => {
    const {data} = await axios.put(`${BASE_URL}/api/post/${id}`);
    return data.comments;
}

export const getRandomGradient = (idx: number) => {
    return randomGradients[idx];
}