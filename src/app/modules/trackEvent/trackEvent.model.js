import mongoose, { Schema } from "mongoose";

const trackEventSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "CompanyStore",   // ✅ fixed
      required: true,
      index: true,
    },

    eventName: {
      type: String,
      required: true,
      enum: [
        "page_view",
        "view_item",
        "select_item",
        "view_item_list",
        "add_to_cart",
        "remove_from_cart",
        "view_cart",
        "begin_checkout",
        "add_shipping_info",
        "add_payment_info",
        "purchase",
        "add_to_wishlist",
      ],
    },

    platform: {
      type: String,
      required: true,
      enum: ["meta", "ga4", "tiktok", "gtm", "all"], // ✅ "all" যোগ হলো
    },

    source: {
      type: String,
      required: true,
      enum: ["client", "server"],
    },

    eventId: { type: String, index: true },  // deduplication key
    orderId: { type: String, index: true },

    value:    { type: Number },
    currency: { type: String, default: "BDT" },

    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
      index: true,
    },

    errorMessage: { type: String },
    retryCount:   { type: Number, default: 0 },

    payload:  { type: Schema.Types.Mixed, default: null },
    response: { type: Schema.Types.Mixed, default: null },

    firedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

// ─── Compound Indexes ───────────────────────────────────
trackEventSchema.index({ status: 1, retryCount: 1 });        // retry queue
trackEventSchema.index({ storeId: 1, firedAt: -1 });         // dashboard filter
trackEventSchema.index({ orderId: 1, platform: 1, source: 1 }); // duplicate check
trackEventSchema.index(
  { firedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }                  // 30 দিন TTL
);

// ✅ Production safe export
export const TrackEvent =
  mongoose.models.TrackEvent ||
  mongoose.model("TrackEvent", trackEventSchema);
  

// import {Schema, model} from "mongoose";

// // Declare the Schema of the Mongo model
// const trackEventSchema = new Schema(
//   {
//     storeId: {
//       type: Schema.Types.ObjectId,
//       ref: "Store",
//       required: true,
//       index: true,
//     },

//     eventName: {
//       type: String,
//       required: true,
//       enum: [
//         "page_view",
//         "view_item",
//         "select_item",
//         "view_item_list",
//         "add_to_cart",
//         "remove_from_cart",
//         "view_cart",
//         "begin_checkout",
//         "add_shipping_info",
//         "add_payment_info",
//         "purchase",
//         "add_to_wishlist",
//       ],
//     },

//     platform: {
//       type: String,
//       required: true,
//       enum: ["meta", "ga4", "tiktok", "gtm"],
//     },

//     source: {
//       type: String,
//       required: true,
//       enum: ["client", "server"],
//     },

//     // deduplication এর জন্য — client ও server এ same id দিতে হবে
//     eventId: { type: String, index: true },
//     orderId: { type: String, index: true },

//     value: { type: Number },
//     currency: { type: String, default: "BDT" },

//     status: {
//       type: String,
//       enum: ["success", "failed", "pending"],
//       default: "pending",
//       index: true,
//     },

//     errorMessage: { type: String },
//     retryCount: { type: Number, default: 0 },

//     // dev/staging তে full data রাখো, prod এ null
//     payload: { type: Schema.Types.Mixed, default: null },
//     response: { type: Schema.Types.Mixed, default: null },

//     firedAt: { type: Date, default: Date.now, index: true },
//   },
//   {
//     timestamps: false,
//   },
// );


// // ─── Compound indexes ──────────────────────────────────
// // failed events retry queue
// trackEventSchema.index({ status: 1, retryCount: 1 });

// // dashboard এ store + date range filter
// trackEventSchema.index({ storeId: 1, firedAt: -1 });

// // duplicate check — same orderId + platform + source
// trackEventSchema.index({ orderId: 1, platform: 1, source: 1 });

// // 30 দিন পর auto delete — TTL index
// trackEventSchema.index(
//   { firedAt: 1 },
//   { expireAfterSeconds: 60 * 60 * 24 * 30 },
// );

// // Export the model
// export const TrackEvent = model("TrackEvent", trackEventSchema);
