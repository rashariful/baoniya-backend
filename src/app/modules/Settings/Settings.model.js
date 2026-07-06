import { Schema, model } from "mongoose";

const SettingsSchema = new Schema(
  {
    schoolName: { type: String },
    logo: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

export const Settings = model("Settings", SettingsSchema);