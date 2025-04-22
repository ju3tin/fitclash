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
  game: { type: String, required: false, unique: false },
  time: { type: String, required: false, unique: false },
  bet: { type: String, required: false, unique: false },
  offer: offerSchema,
  answer: answerSchema,
  offerUpdated: { type: Boolean, default: false },
  answerUpdated: { type: Boolean, default: false },
});

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
