
import {Schema, model} from "mongoose";

// Declare the Schema of the Mongo model
const StudentSchema = new Schema(
  {
    // Define the schema fields
  },
  {
    timestamps: true,
  }
);

// Export the model
export const Student = model("Student", StudentSchema);
