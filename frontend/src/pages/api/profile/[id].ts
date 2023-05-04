// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import {client} from "../../../util/client";
import {singleUserQuery, userCreatedPostsQuery, userLikedPostsQuery} from "../../../util/queries";

type Data = {
    name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'GET') {
        const {id} = req.query;

        const query = singleUserQuery(id as string);
        const userVideosQuery = userCreatedPostsQuery(id as string);
        const userLikedVideosQuery = userLikedPostsQuery(id as string);

        const user = await client.fetch(query);
        const userVideos = await client.fetch(userVideosQuery);
        const userLikedVideos = await client.fetch(userLikedVideosQuery);

        res.status(200).json({
            user: user[0],
            userVideos,
            userLikedVideos
        })
    }
}


