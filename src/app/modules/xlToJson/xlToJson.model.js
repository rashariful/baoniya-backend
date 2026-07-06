import mongoose, { Schema, model } from "mongoose";

const xlToJsonDataSchema = new Schema({}, { strict: false });

export const XlToJsonData = model("XlToJsonData", xlToJsonDataSchema);
