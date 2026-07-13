
import {Schema, model} from "mongoose";

// Declare the Schema of the Mongo model
const GallerySchema = new Schema(
  {
     name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
export const Gallery = model("Gallery", GallerySchema);
