import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb1";
import Room from "../../models/Room";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { room, offer, answer } = body;   

    if (!room || !offer || !answer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newRoom = await Room.create({ room, offer, answer });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (err) {
    console.error("Error creating room:", err);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
