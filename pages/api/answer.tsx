// pages/api/room.js
import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb1";
import Room from "../../models/Room";



import { NextApiRequest, NextApiResponse } from 'next'; // Import types

export default async function handler(req: NextApiRequest, res: NextApiResponse) { // Explicitly type parameters
  await connectDB();
  if (req.method === 'POST') {
    const { offer, answer } = req.body;
    const { room } = req.query;
  
    if (!room) {
      return res.status(400).json({ error: 'Missing room query parameter' });
    }
  
    try {
        const updateData: { offer?: any; answer?: any } = {}; // Ensure both properties are defined
        if (offer && offer.type && offer.sdp) {
          updateData.offer = offer;
        }
        if (answer && answer.type && answer.sdp) {
          updateData.answer = answer;
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
      res.status(500).json({ error: 'Failed to create/update room' });
    }
  }
}