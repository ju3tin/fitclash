// pages/api/rooms.ts
import client from "../../lib/contact";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = client.db("fitclash");

    const { room } = req.query;

    const query: any = {};

    // If "room" is provided in the URL, filter by it
    if (room) {
      query.room = room;
    }

    const rooms = await db
      .collection("rooms")
      .find(query)
      .sort({ metacritic: -1 }) // optional: only if this field exists
      .limit(10)
      .toArray();

    res.status(200).json(rooms);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
}
