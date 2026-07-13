import { Schema, model } from "mongoose";

// Declare the Schema of the Mongo model
const BannerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    // redirectUrl: {
    //   type: String,
    //   required: true,
    // },
    // bannerType: {
    //   type: String,
    //   enum: ["primary", "secondary", "popup"],
    //   default: "primary",
    // },

    // order: {
    //   type: Number,
    //   required: true,
    // },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Export the model
export const Banner = model("Banner", BannerSchema);
