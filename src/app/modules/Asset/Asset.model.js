
import {Schema, model} from "mongoose";

// Declare the Schema of the Mongo model
const AssetSchema = new Schema(
 {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String, // e.g. Furniture, Electronics, Utensils, Bedding
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'not_available', 'damaged', 'in_repair'],
      default: 'available',
    },
  },
  { timestamps: true }
);

// Export the model
export const Asset = model("Asset", AssetSchema);
