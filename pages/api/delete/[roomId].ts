import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/contact';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = client.db("fitclash");

  const { roomId } = req.query;

  // Ensure roomId is a string
  const roomIdString = Array.isArray(roomId) ? roomId[0] : roomId;

  if (req.method === "DELETE") {
    try {
      // Validate that roomId exists
      if (!roomIdString) {
        return res.status(400).json({ message: "Room identifier is required" });
      }

      // Check if the roomId is a valid ObjectId (MongoDB)
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(roomIdString);

      // Prepare the query filter - check if it's a valid ObjectId or room name
      const query = isObjectId ? { _id: new ObjectId(roomIdString) } : { room: roomIdString };

      // Delete the room by the room name or ObjectId
      const result = await db.collection("rooms").deleteOne(query);

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Room not found" });
      }

      // Respond with a success message
      res.status(200).json({ message: "Room deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Method not allowed for other HTTP methods
    res.status(405).json({ message: "Method not allowed" });
  }
}
