import mongoose from "mongoose";

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
  offer: offerSchema,
  answer: answerSchema,
});

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
