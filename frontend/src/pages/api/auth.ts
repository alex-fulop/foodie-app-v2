// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import {client} from "../../util/client";

type Data = {
    name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if(req.method === 'POST') {
        const doc = req.body;

        client.createIfNotExists(doc)
            .then(() => res.status(200).json('Login success'));
    }
}


