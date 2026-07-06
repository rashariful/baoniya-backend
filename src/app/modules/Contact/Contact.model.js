
import {Schema, model} from "mongoose";

// Declare the Schema of the Mongo model
const ContactSchema = new Schema(
  {
    // Define the schema fields
  },
  {
    timestamps: true,
  }
);

// Export the model
export const Contact = model("Contact", ContactSchema);
