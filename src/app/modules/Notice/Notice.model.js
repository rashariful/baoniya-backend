import { Schema, model } from "mongoose";

const NoticeSchema = new Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: function() {
        return !this.thumbnail;
      }
    },
    thumbnail: { 
      type: String, 
      required: function() {
        return !this.message;
      }
    },
    audience: {
      type: String,
      enum: ["public", "students", "teachers"],
      default: "public"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    startDate: { 
      type: Date, 
      required: true, 
      default: Date.now 
    },
    endDate: { 
      type: Date, 
      required: true 
    },
  },
  { timestamps: true }
);

export const Notice = model("Notice", NoticeSchema);