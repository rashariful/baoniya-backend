import { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },

    type: {
      type: String,
      enum: ["broadcast_all", "broadcast_selected", "broadcast_due_fees", "individual"],
      default: "individual",
    },

    channel: {
      type: String,
      enum: ["sms", "email", "push"],
      default: "sms",
    },

    recipientCount: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },

    failedRecipients: [
      {
        phone: String,
        name: String,
        error: String,
      },
    ],

    sentBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Notification = model("Notification", NotificationSchema);