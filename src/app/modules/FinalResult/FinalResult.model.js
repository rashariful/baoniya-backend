
import {Schema, model} from "mongoose";

// Declare the Schema of the Mongo model
const FinalResultSchema = new Schema(
  {
    // Define the schema fields
  },
  {
    timestamps: true,
  }
);

// Export the model
export const FinalResult = model("FinalResult", FinalResultSchema);
