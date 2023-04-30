// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../util/client";
import { topicPostsQuery } from "../../../util/queries";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { topic } = req.query;

    // const tiktokVideos = await client.fetch('https://open-api.tiktok.com/video/query/');

    const videosQuery = topicPostsQuery(topic);

    const videos = await client.fetch(videosQuery);

    res.status(200).json(videos);
  }
}
