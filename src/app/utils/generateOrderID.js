import mongoose from "mongoose";

// ১. Counter Schema (প্রতিদিনের সিকোয়েন্স ট্র্যাক করার জন্য)
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g., "order_seq_260530"
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

/**
 * Luhn Algorithm ব্যবহার করে ১ ডিজিটের Check Digit বের করার ফাংশন
 * (ব্যাংকিং কার্ড ভ্যালিডেশনের স্ট্যান্ডার্ড মেথড)
 */
const calculateLuhnCheckDigit = (numberString) => {
  let sum = 0;
  let shouldDouble = true; // ডান দিক থেকে শুরু করলে চেক ডিজিটের আগের সংখ্যাটি ডাবল হয়

  // সংখ্যার একদম শেষ থেকে পিছনের দিকে লুপ চলবে
  for (let i = numberString.length - 1; i >= 0; i--) {
    let digit = parseInt(numberString.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  // ১০ থেকে ভাগশেষ বিয়োগ করে ফাইনাল চেক ডিজিট বের করা হয়
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit.toString();
};

// ২. ডাইনামিক ডেট এবং Luhn Checksum সহ অর্ডার আইডি জেনারেটর ফাংশন
const generateOrderID = async () => {
  const now = new Date();

  // বছর (Year) -> e.g., "26"
  const yy = now.getFullYear().toString().slice(-2); 
  
  // মাস (Month) -> e.g., "05"
  const mm = (now.getMonth() + 1).toString().padStart(2, "0"); 
  
  // দিন (Date) -> e.g., "30"
  const dd = now.getDate().toString().padStart(2, "0"); 

  // ৩টি মিলিয়ে ডেট পার্ট তৈরি (e.g., "260530")
  const dateStr = `${yy}${mm}${dd}`; 
  
  // প্রতিদিনের জন্য আলাদা কাউন্টার আইডি (e.g., "order_seq_260530")
  const counterId = `order_seq_${dateStr}`;

  // Atomic Operation: ডুপ্লিকেট প্রুফ কাউন্টার ইনক্রিমেন্ট
  const counter = await Counter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // ৫ ডিজিটের প্যাডিং (e.g., "00001")
  const paddedSequence = counter.seq.toString().padStart(5, "0");

  // এই বেইজ সংখ্যার ওপর ভিত্তি করে ক্রেডিট কার্ডের মতো লুন চেক সাম হিসাব হবে
  const baseNumber = `${dateStr}${paddedSequence}`; // e.g., "26053000001"
  
  // ব্যাংকিং কার্ডের অ্যালগরিদম দিয়ে লাস্ট সিক্রেট ডিজিট জেনারেট করা হলো
  const checkDigit = calculateLuhnCheckDigit(baseNumber); 

  // ফাইনাল আউটপুট ফরম্যাট: UPN- + YYMMDD + SEQUENCE + LUHN_DIGIT
  return `UPN-${baseNumber}${checkDigit}`; 
  // উদাহরণ: আজ প্রথম অর্ডার করলে আইডি হবে -> UPN-260530000014
};

export default generateOrderID;

// import mongoose from "mongoose";

// // ১. Counter Schema (প্রতিদিনের সিকোয়েন্স ট্র্যাক করার জন্য)
// const CounterSchema = new mongoose.Schema({
//   _id: { type: String, required: true }, // e.g., "order_seq_260530"
//   seq: { type: Number, default: 0 }
// });
// const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

// // ২. ডাইনামিক ডেট সহ অর্ডার আইডি জেনারেটর ফাংশন
// const generateOrderID = async () => {
//   const now = new Date();

//   // বছর (Year) -> e.g., "26"
//   const yy = now.getFullYear().toString().slice(-2); 
  
//   // মাস (Month) -> e.g., "05" (padStart দিয়ে ২ ডিজিট নিশ্চিত করা হয়েছে)
//   const mm = (now.getMonth() + 1).toString().padStart(2, "0"); 
  
//   // দিন (Date) -> e.g., "30"
//   const dd = now.getDate().toString().padStart(2, "0"); 

//   // ৩টি মিলিয়ে ডেট পার্ট তৈরি (e.g., "260530")
//   const dateStr = `${yy}${mm}${dd}`; 
  
//   // প্রতিদিনের জন্য আলাদা কাউন্টার আইডি (e.g., "order_seq_260530")
//   const counterId = `order_seq_${dateStr}`;

//   // Atomic Operation: ১ জন বা ১০০০ জন একসাথে অর্ডার করলেও ডুপ্লিকেট হবে না
//   const counter = await Counter.findOneAndUpdate(
//     { _id: counterId },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true } // নতুন দিন হলে অটো ০ থেকে কাউন্ট শুরু করবে
//   );

//   // ৫ ডিজিটের প্যাডিং (e.g., 1 কে করবে "00001")
//   const paddedSequence = counter.seq.toString().padStart(5, "0");

//   // ফাইনাল আউটপুট ফরম্যাট: UPN + YYMMDD + SEQUENCE
//   return `UPN-${dateStr}${paddedSequence}`; 
//   // উদাহরণ: আজ অর্ডার করলে আইডি হবে -> UPN26053000001
// };

// export default generateOrderID;


// import { Sales } from "../modules/sales/sales.model.js";

// const generateOrderID = async () => {
//   const lastOrder = await Sales.findOne({}, { orderId: 1 })
//     .sort({ createdAt: -1 })
//     .lean();

//   const year = new Date().getFullYear().toString().slice(-2); // e.g., "25"

//   if (lastOrder?.orderId?.startsWith(`UPN${year}`)) {
//     const numericPart = parseInt(lastOrder.orderId.slice(5)) || 0;
//     const nextNumber = numericPart + 1;
//     const padded = nextNumber.toString().padStart(5, "0");

//     return `UPN${year}${padded}`;
//   }

//   // If no valid order or wrong format
//   return `UPN${year}00001`;
// };

// export default generateOrderID;
