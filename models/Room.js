import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";
import { type } from "os";

const offerSchema = new mongoose.Schema({
  type: String,
  sdp: String,
}, { _id: false });

const answerSchema = new mongoose.Schema({
  type: String,
  sdp: String,
}, { _id: false });

const RoomSchema = new mongoose.Schema({
  room: { type: String, required: true, unique: true },
  game: { type: String, required: false, unique: false },
  time: { type: String, required: false, unique: false },
  offer: offerSchema,
  answer: answerSchema,
});

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
