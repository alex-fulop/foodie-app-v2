// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import {allPostsQuery} from "../../../util/queries";
import {client} from "../../../util/client";

type Data = {
    name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if(req.method === 'GET') {
        const query = allPostsQuery();

        const data = await client.fetch(query);

        res.status(200).json(data);
    } else if (req.method === 'POST') {
        const document = req.body;

        client.create(document)
            .then(() => res.status(201).json('Video Created'));
    }
}


