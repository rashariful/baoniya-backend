import { Schema, model } from "mongoose";

// Declare the Schema of the Mongo model
const LibrarySchema = new Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: false,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue"],
      default: "borrowed",
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
export const Library = model("Library", LibrarySchema);