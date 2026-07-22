import { Notification } from "./Notification.model.js";
import { SmsSender } from "../../middlewares/smsSender.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { Student } from "../Student/Student.model.js";
import { Fees } from "../fees/Fees.model.js";
import { Teacher } from "../Teacher/Teacher.model.js";

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

// import { Teacher } from "../Teacher/Teacher.model.js"; // path adjust koro

// ============================
// Recipient list — students grouped by class (SMS sender UI)
// ============================
const getStudentRecipients = async ({ classId, search } = {}) => {
  const filter = { status: "active" };
  if (classId) filter.classId = classId;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { studentId: { $regex: search, $options: "i" } },
    ];
  }

  const students = await Student.find(filter)
    .populate("classId", "name code")
    .select("name studentId roll guardianName guardianPhone classId sectionId")
    .sort({ name: 1 })
    .lean();

  const grouped = {};
  for (const s of students) {
    const className = s.classId?.name || "Unassigned";
    if (!grouped[className]) grouped[className] = [];
    grouped[className].push({
      id: s._id,
      name: s.name,
      studentId: s.studentId,
      roll: s.roll,
      guardianName: s.guardianName,
      phone: s.guardianPhone,
    });
  }

  return grouped;
};

// ============================
// Recipient list — teachers
// ============================
const getTeacherRecipients = async ({ search } = {}) => {
  const filter = { status: "Active" }; // ⚠️ Teacher schema e capital "Active"
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { teacherId: { $regex: search, $options: "i" } },
    ];
  }

  const teachers = await Teacher.find(filter)
    .select("name phone teacherId designation")
    .sort({ name: 1 })
    .lean();

  return teachers.map((t) => ({
    id: t._id,
    name: t.name,
    phone: t.phone,
    teacherId: t.teacherId,
    designation: t.designation,
  }));
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
  getStudentRecipients,   // ✅ new
  getTeacherRecipients,   // ✅ new
};

