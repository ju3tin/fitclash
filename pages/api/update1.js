import connectDB from '../../lib/mongodb1';
import Room from '../../models/Room';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { room } = req.query;
    const { time, game, bet, offer, answer } = req.body;

    if (!room) {
      return res.status(400).json({ error: 'Missing room in query' });
    }

    try {
      const updatedRoom = await Room.findOneAndUpdate(
        { room },
        {
          room,
          ...(time && { time }),
          ...(game && { game }),
          ...(bet && { bet }),
          ...(offer && { offer }),
          ...(answer && { answer }),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({ success: true, data: updatedRoom });
    } catch (error) {
      console.error('Update failed:', error);
      res.status(500).json({ error: 'Failed to update room' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
