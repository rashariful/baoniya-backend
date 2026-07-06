
import {Schema, model} from "mongoose";

// Declare the Schema of the Mongo model
const trackConfigSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "CompanyStore",
      required: true,
      unique: true,
      index: true,
    },

    gtm: {
      enabled:   { type: Boolean, default: false },
      id:        { type: String,  default: "" },
      serverUrl: { type: String,  default: "" },
    },

    meta: {
      enabled:       { type: Boolean, default: false },
      pixelId:       { type: String,  default: "" },
      capiToken:     { type: String,  default: "" },
      testEventCode: { type: String,  default: "" },
    },

    ga4: {
      enabled:       { type: Boolean, default: false },
      measurementId: { type: String,  default: "" },
      apiSecret:     { type: String,  default: "" },
    },

    tiktok: {
      enabled:     { type: Boolean, default: false },
      pixelId:     { type: String,  default: "" },
      eventsToken: { type: String,  default: "" },
    },

    serverSideEnabled: { type: Boolean, default: false },

    environment: {
      type:    String,
      enum:    ["development", "staging", "production"],
      default: "production",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref:  "User",
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
export const TrackConfig = model("TrackConfig", trackConfigSchema);
