import connectDB from "../../lib/mongodb1";
import Room from "../../models/Room";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { room, game, time, bet, offer, answer } = req.body;

    if (!room) return res.status(400).json({ error: 'Missing room name' });

    try {
      const newRoom = await Room.create({
        room,
        game,
        time,
        bet,
        offer: offer ? [offer] : [],
        answer: answer ? [answer] : []
      });

      return res.status(201).json({ success: true, data: newRoom });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create room' });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
