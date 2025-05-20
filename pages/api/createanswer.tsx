import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb1';
import Room from '../../models/Room';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { room } = req.query;
  const { answer } = req.body;

  if (!room || typeof room !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid room query parameter' });
  }

  if (
    !answer ||
    typeof answer !== 'object' ||
    typeof answer.type !== 'string' ||
    typeof answer.sdp !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid or missing answer object in request body' });
  }

  try {
    const updatedRoom = await Room.findOneAndUpdate(
      { room },
      {
        $set: {
          answer,
          answerUpdated: true,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }

    return res.status(200).json({ success: true, data: updatedRoom });
  } catch (error) {
    console.error('Update failed:', error);
    return res.status(500).json({ error: 'Failed to update room' });
  }
}
