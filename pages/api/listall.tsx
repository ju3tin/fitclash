import client from "../../lib/contact";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const db = client.db("fitclash");
        const movies = await db
            .collection("rooms")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();
        res.json(movies);
    } catch (e) {
        console.error(e);
    }
}