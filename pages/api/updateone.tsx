import client from "../../lib/contact";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = client.db("fitclash");

  if (req.method === "PUT") {
    try {
      const { room, game, time, bet, offer, answer, offerUpdated, answerUpdated } = req.body;

      // Optional: validate data here
      if (!room) {
        return res.status(400).json({ message: "Missing required field: room" });
      }

      // Build an update object, only including fields that are provided in the request
      const updateData: any = {};

      // Update fields if provided in the request body
      if (game) updateData.game = game;
      if (time) updateData.time = time;
      if (bet) updateData.bet = bet;

      if (offerUpdated && offer) {
        updateData.offer = offer;
        updateData.offerUpdated = true;
      }
      if (answerUpdated && answer) {
        updateData.answer = answer;
        updateData.answerUpdated = true;
      }  // Only update answer if answerUpdated is true

      // If no fields to update, return a message
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }

      // Update the room with only the fields that are present in the request
      const result = await db.collection("rooms").updateOne(
        { room },  // Find room by its name
        { $set: updateData },  // Only update the provided fields
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
