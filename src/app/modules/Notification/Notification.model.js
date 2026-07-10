
import {Schema, model} from "mongoose";

// Declare the Schema of the Mongo model
const NotificationSchema = new Schema(
  {
    // Define the schema fields
  },
  {
    timestamps: true,
  }
);

// Export the model
export const Notification = model("Notification", NotificationSchema);
