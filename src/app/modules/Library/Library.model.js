
import {Schema, model} from "mongoose";

// Declare the Schema of the Mongo model
const LibrarySchema = new Schema(
  {
    // Define the schema fields
  },
  {
    timestamps: true,
  }
);

// Export the model
export const Library = model("Library", LibrarySchema);
