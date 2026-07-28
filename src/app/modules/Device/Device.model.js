import { Schema, model } from "mongoose";

const DeviceSchema = new Schema(
  {
    deviceName: { type: String, required: true }, // "Main Gate Device"
    deviceId: { type: String, required: true, unique: true }, // internal reference ID, e.g. "hik-device-1"
    ip: { type: String, required: true },
    port: { type: Number, default: 80 },
    username: { type: String, required: true },
    password: { type: String, required: true }, // encrypt kora bhalo, MVP e plain rakhtei paren
    serialNumber: { type: String },
    location: { type: String }, // "Main Campus", "Sylhet Branch"
    status: {
      type: String,
      enum: ["active", "inactive", "offline"],
      default: "active",
    },
    lastSyncedAt: { type: Date },
  },
  { timestamps: true }
);

export const Device = model("Device", DeviceSchema);