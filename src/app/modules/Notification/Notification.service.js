import { Notification } from "./Notification.model.js";
import { SmsSender } from "../../middlewares/smsSender.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { Student } from "../Student/Student.model.js";
import { Fees } from "../fees/fees.model.js";

// ============================
// Existing CRUD (unchanged)
// ============================
const createNotification = async (payload) => {
  const result = await Notification.create(payload);
  return result;
};

const getAllNotification = async (query) => {
  const NotificationSearchableFields = [];
  const resultQuery = new QueryBuilder(Notification.find(), query)
    .search(NotificationSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();
  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();
  return { data: result, meta };
};

const getSingleNotification = async (id) => {
  const result = await Notification.findById(id);
  return result;
};

const updateNotification = async (id, payload) => {
  const result = await Notification.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteNotification = async (id) => {
  const result = await Notification.findByIdAndDelete(id);
  return result;
};

// ============================
// Broadcast helper — sob dispatch logic ekhane centralize
// ============================
const dispatchSms = async (recipients, message) => {
  const results = await Promise.allSettled(
    recipients.map((r) => SmsSender.sendSMS(r.guardianPhone, message))
  );

  const failedRecipients = [];
  let successCount = 0;

  results.forEach((res, idx) => {
    if (res.status === "fulfilled") {
      successCount++;
    } else {
      failedRecipients.push({
        phone: recipients[idx].guardianPhone,
        name: recipients[idx].name,
        error: res.reason?.message || "Unknown error",
      });
    }
  });

  return {
    successCount,
    failedCount: failedRecipients.length,
    failedRecipients,
  };
};

// ============================
// 1. Broadcast to ALL active students
// ============================
const broadcastToAll = async (message, sentBy) => {
  const students = await Student.find({ status: "active" }).select(
    "guardianPhone name"
  );

  const recipients = students.filter((s) => s.guardianPhone);

  const { successCount, failedCount, failedRecipients } = await dispatchSms(
    recipients,
    message
  );

  const notification = await Notification.create({
    title: "Broadcast - All Students",
    message,
    type: "broadcast_all",
    channel: "sms",
    recipientCount: recipients.length,
    successCount,
    failedCount,
    failedRecipients,
    sentBy,
  });

  return notification;
};

// ============================
// 2. Broadcast to SELECTED students
// ============================
const broadcastToSelected = async (studentIds, message, sentBy) => {
  const students = await Student.find({
    _id: { $in: studentIds },
  }).select("guardianPhone name");

  const recipients = students.filter((s) => s.guardianPhone);

  const { successCount, failedCount, failedRecipients } = await dispatchSms(
    recipients,
    message
  );

  const notification = await Notification.create({
    title: "Broadcast - Selected Students",
    message,
    type: "broadcast_selected",
    channel: "sms",
    recipientCount: recipients.length,
    successCount,
    failedCount,
    failedRecipients,
    sentBy,
  });

  return notification;
};

// ============================
// 3. Broadcast to DUE-FEE students
// ============================
const broadcastToDueFees = async (message, month, sentBy) => {
  // step 1: oi month e je student ra paid (fully paid) tader id ber koro
  const paidStudentIds = await Fees.distinct("studentId", {
    month,
    status: "paid",
  });

  // step 2: active student der modhdhe jara paid list e nai (unpaid + partial + no record)
  const dueStudents = await Student.find({
    status: "active",
    _id: { $nin: paidStudentIds },
  }).select("guardianPhone name");

  const recipients = dueStudents.filter((s) => s.guardianPhone);

  const { successCount, failedCount, failedRecipients } = await dispatchSms(
    recipients,
    message
  );

  const notification = await Notification.create({
    title: `Broadcast - Due Fees (${month})`,
    message,
    type: "broadcast_due_fees",
    channel: "sms",
    recipientCount: recipients.length,
    successCount,
    failedCount,
    failedRecipients,
    sentBy,
  });

  return notification;
};

export const NotificationServices = {
  createNotification,
  getAllNotification,
  getSingleNotification,
  updateNotification,
  deleteNotification,
  broadcastToAll,
  broadcastToSelected,
  broadcastToDueFees,
};