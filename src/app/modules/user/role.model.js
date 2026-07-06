import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [
      {
        type: String,
      },
    ], // e.g., ['READ_USERS', 'MANAGE_ORDERS']
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", RoleSchema);
