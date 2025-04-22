import client from "../../lib/contact";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = client.db("fitclash");

  if (req.method === "PUT") {
    try {
      const { room, game, time, bet, offer, answer } = req.body;

      // Optional: validate data here
      if (!room) {
        return res.status(400).json({ message: "Missing required field: room" });
      }

      const updatedData = { room, game, time, bet, offer, answer };

      // Try to find the room and update it if it exists
      const result = await db.collection("rooms").updateOne(
        { room },  // Find room by its name
        { $set: updatedData },  // Update fields
        { upsert: true }  // If the room does not exist, insert it
      );

      if (result.modifiedCount === 0 && result.upsertedCount === 0) {
        return res.status(404).json({ message: "Room not found to update" });
      }

      res.status(200).json({ message: "Room updated", id: room });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
