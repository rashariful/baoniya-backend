import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
    },
    address: {
      type: String,
      required: true,
    },
  isActive: {
    type: Boolean,
    default: true, 
  }

  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
