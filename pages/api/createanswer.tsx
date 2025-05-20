import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb1';
import Room from '../../models/Room';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'PUT') {
    const { room } = req.query;
    const { answer } = req.body;

    if (!room || typeof room !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid room query parameter' });
    }

    if (!answer) {
      return res.status(400).json({ error: 'Missing answer in request body' });
    }

    try {
      const updatedRoom = await Room.findOneAndUpdate(
        { room }, // Match based on room field
        { $push: { answer: answer } }, // Push to 'answer' array
        { new: true } // Return updated document
      );

      if (!updatedRoom) {
        return res.status(404).json({ error: 'Room not found' });
      }

      return res.status(200).json({ success: true, data: updatedRoom });

    } catch (error) {
      console.error('Update failed:', error);
      return res.status(500).json({ error: 'Failed to update room' });
    }

  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
