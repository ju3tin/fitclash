
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

    }

}  