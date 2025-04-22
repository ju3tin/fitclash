// pages/api/room.js
import connectDB from "../../lib/mongodb1";
import Room from "../../models/Room";

export default async function handler(req, res) {
  await connectDB();

  const room = req.query.room; // pull from URL like ?room=my-room-456

  if (!room) {
    return res.status(400).json({ error: 'Missing room in query' });
  }

  if (req.method === 'POST') {
    const { time, game, bet, offer, answer } = req.body;

    try {
      const updatedRoom = await Room.findOneAndUpdate(
        { room },
        {
          $set: { time, game, bet },
          $push: {
            offer: { $each: offer || [] },
            answer: { $each: answer || [] }
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({ success: true, data: updatedRoom });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update room' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
