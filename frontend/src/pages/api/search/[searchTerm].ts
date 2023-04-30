// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import {client} from "../../../util/client";
import {searchPostsQuery} from "../../../util/queries";

type Data = {
    name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'GET') {
        const {searchTerm} = req.query;

        const videosQuery = searchPostsQuery(searchTerm);

        const videos = await client.fetch(videosQuery);

        res.status(200).json(videos);
    }
}


