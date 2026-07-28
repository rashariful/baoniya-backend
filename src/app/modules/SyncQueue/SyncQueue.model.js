import { Schema, model } from "mongoose";

const SyncQueueSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    action: { type: String, enum: ["create", "update", "delete"], required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    retryCount: { type: Number, default: 0 },
    lastError: { type: String },
  },
  { timestamps: true }
);

export const SyncQueue = model("SyncQueue", SyncQueueSchema);