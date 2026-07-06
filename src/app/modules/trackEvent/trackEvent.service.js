import { TrackEvent } from "./trackEvent.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

import { sendToMetaCAPI } from "./platforms/meta.js";
import { sendToGA4 } from "./platforms/ga4.js";
import { sendToTikTok } from "./platforms/tiktok.js";
import { TrackConfig } from "../trackConfig/trackConfig.model.js";


const createTrackEvent = async (payload, requestMeta = {}) => {
  const event = await TrackEvent.create(payload);

  const config = await TrackConfig.findOne({
    storeId: payload.storeId,
  }).lean();

  if (!config) return event;

  // ✅ userData — request + payload থেকে
  const userData = {
    ip: requestMeta.ip,
    userAgent: requestMeta.userAgent,
    email: payload.email,
    phone: payload.phone,
    firstName: payload.firstName, // ✅ যোগ হলো
    lastName: payload.lastName, // ✅ যোগ হলো
    city: payload.city, // ✅ যোগ হলো
    fbp: payload.fbp,
    fbc: payload.fbc,
  };

  const [metaResult, ga4Result, tiktokResult] = await Promise.allSettled([
    config.meta?.enabled
      ? sendToMetaCAPI(event, config.meta, userData)
      : Promise.resolve({ skipped: true }),

    config.ga4?.enabled
      ? sendToGA4(event, config.ga4)
      : Promise.resolve({ skipped: true }),

    config.tiktok?.enabled
      ? sendToTikTok(event, config.tiktok)
      : Promise.resolve({ skipped: true }),
  ]);

  const allSkipped = [metaResult, ga4Result, tiktokResult].every(
    (r) => r.value?.skipped,
  );

  const hasFailure = [metaResult, ga4Result, tiktokResult].some(
    (r) => r.status === "rejected",
  );

  const finalStatus = allSkipped
    ? "pending"
    : hasFailure
      ? "failed"
      : "success";

  const updated = await TrackEvent.findByIdAndUpdate(
    event._id,
    {
      status: finalStatus,
      response: {
        meta: {
          status: metaResult.status,
          data: metaResult.value || metaResult.reason?.message,
        },
        ga4: {
          status: ga4Result.status,
          data: ga4Result.value || ga4Result.reason?.message,
        },
        tiktok: {
          status: tiktokResult.status,
          data: tiktokResult.value || tiktokResult.reason?.message,
        },
      },
    },
    { new: true },
  );

  return updated;
};

const getAllTrackEvent = async (query) => {
  const trackEventSearchableFields = [];
  const resultQuery = new QueryBuilder(TrackEvent.find(), query)
    .search(trackEventSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();
  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();

  return {
    data: result,
    meta,
  };
};
const getSingleTrackEvent = async (id) => {
  const result = await TrackEvent.findById(id);
  return result;
};
const updateTrackEvent = async (id, payload) => {
  const result = await TrackEvent.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteTrackEvent = async (id) => {
  const result = await TrackEvent.findByIdAndDelete(id);
  return result;
};

export const TrackEventServices = {
  createTrackEvent,
  getAllTrackEvent,
  getSingleTrackEvent,
  updateTrackEvent,
  deleteTrackEvent,
};
