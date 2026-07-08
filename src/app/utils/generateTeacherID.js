// utils/generateTeacherID.js
import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

const calculateLuhnCheckDigit = (numberString) => {
  let sum = 0;
  let shouldDouble = true;

  for (let i = numberString.length - 1; i >= 0; i--) {
    let digit = parseInt(numberString.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return ((10 - (sum % 10)) % 10).toString();
};

const generateTeacherID = async (prefix = "TCH", session = null) => {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);

  const counterId = `teacher_seq_${yy}`;

  const counter = await Counter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session }
  );

  const paddedSequence = counter.seq.toString().padStart(4, "0");
  const baseNumber = `${yy}${paddedSequence}`;
  const checkDigit = calculateLuhnCheckDigit(baseNumber);

  return `${prefix}-${yy}-${paddedSequence}-${checkDigit}`;
  // Example: TCH-26-0001-8
};

export default generateTeacherID;