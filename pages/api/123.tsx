import client from "../../lib/contact";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = client.db("fitclash");

  if (req.method === "POST") {
    try {
      const data = req.body;

      // Optional: validate data here
      if (!data || !data.room) {
        return res.status(400).json({ message: "Missing required field: room" });
      }

      const result = await db.collection("rooms").insertOne(data);

      res.status(201).json({ message: "Room created", id: result.insertedId });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
