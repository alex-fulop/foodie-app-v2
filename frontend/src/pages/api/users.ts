// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import {client} from "../../util/client";
import {allUsersQuery} from "../../util/queries";

type Data = {
    name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'GET') {
        const data = await client.fetch(allUsersQuery());

        if (data) {
            res.status(200).send(data);
        } else {
            res.json([]);
        }
    }
}


