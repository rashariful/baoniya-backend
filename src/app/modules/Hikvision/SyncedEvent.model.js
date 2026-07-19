// modules/hikvision/syncedEvent.model.js
import { Schema, model } from "mongoose";

const SyncedEventSchema = new Schema({
  serialNo: { type: Number, required: true, unique: true },
  processedAt: { type: Date, default: Date.now },
});

export const SyncedEvent = model("SyncedEvent", SyncedEventSchema);