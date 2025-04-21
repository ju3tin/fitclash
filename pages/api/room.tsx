// pages/api/room.js
import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb1";
import Room from "../../models/Room";

interface UpdateData {
  offer?: { type: string; sdp: string }; // Define the structure of offer
  answer?: { type: string; sdp: string }; // Define the structure of answer
}

const updateData: UpdateData = {}; // Use the interface to type updateData

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { room, offer, answer } = req.body;

    if (!room || !offer || !offer.type || !offer.sdp) {
      return res.status(400).json({ error: 'Missing room or offer fields' });
    }

    try {
      if (offer && offer.type && offer.sdp) {
        updateData.offer = offer;
      }
      if (answer && answer.type && answer.sdp) {
        updateData.answer = answer;
      }

      const roomData = await Room.findOneAndUpdate(
        { room },
        { room, ...updateData },
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
