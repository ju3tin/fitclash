// pages/api/room.js
import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb1";
import Room from "../../models/Room";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { room, offer, answer } = req.body;

    if (!room || !offer || !offer.type || !offer.sdp) {
      return res.status(400).json({ error: 'Missing room or offer fields' });
    }

    try {
      const roomData = await Room.findOneAndUpdate(
        { room },
        { room, offer, answer },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      res.status(200).json({ success: true, data: roomData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save room' });
    }
  }

  else if (req.method === 'GET') {
    const { room } = req.query;

    if (!room) {
      return res.status(400).json({ error: 'Missing room query parameter' });
    }

    try {
      const roomData = await Room.findOne({ room });

      if (!roomData) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.status(200).json({ success: true, data: roomData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch room' });
    }
  }

  else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
