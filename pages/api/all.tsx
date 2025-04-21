// pages/api/rooms.js
import connectDB from '../../lib/mongodb1';
import Room from '../../models/Room';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const rooms = await Room.find({});
      res.status(200).json({ success: true, data: rooms });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to fetch rooms' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
