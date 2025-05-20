
import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb1";
import Room from "../../models/Room";

import { NextApiRequest, NextApiResponse } from 'next'; // Import types

export default async function handler(req: NextApiRequest, res: NextApiResponse) { // Explicitly type parameters
    await connectDB();
    if (req.method === 'PUT') {
        const { room } = req.query;
        const { answer } = req.body;
        if (!room) {
            return res.status(400).json({ error: 'Missing room query parameter' });
          }
          if (!answer){
            return res.status(401).json({ error: 'Missing the answer' });
        
          }

          try {
            const updatedRoom = await Room.findOneAndUpdate(
              { room },
              {
              /*  $set: { time, game, bet },
                $push: {
                  offer: { $each: offer || [] },
                  answer: { $each: answer || [] }
                }
                  */
              },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );
      
            res.status(200).json({ success: true, data: updatedRoom });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update room' });
          }

    }else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }

}  