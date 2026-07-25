
import {Schema, model} from "mongoose";

// Declare the Schema of the Mongo model
const GradingScaleSchema = new Schema(
  {
    // Define the schema fields
  },
  {
    timestamps: true,
  }
);

// Export the model
export const GradingScale = model("GradingScale", GradingScaleSchema);
