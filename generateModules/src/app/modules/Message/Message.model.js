
import {Schema, model} from "mongoose";

// Declare the Schema of the Mongo model
const MessageSchema = new Schema(
  {
    // Define the schema fields
  },
  {
    timestamps: true,
  }
);

// Export the model
export const Message = model("Message", MessageSchema);
