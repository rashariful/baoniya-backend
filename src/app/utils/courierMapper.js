// utils/courierMapper.js

const COURIER_STATUSES = {
  "pending": { label: "কুরিয়ারে অপেক্ষমান", step: 1 },
  "in_review": { label: "অর্ডার রিভিউ করা হচ্ছে", step: 1 },
  "delivered_approval_pending": { label: "ডেলিভারি সম্পন্ন (অনুমোদনের অপেক্ষায়)", step: 2 },
  "partial_delivered_approval_pending": { label: "আংশিক ডেলিভারি সম্পন্ন (অনুমোদনের অপেক্ষায়)", step: 2 },
  "cancelled_approval_pending": { label: "অর্ডার বাতিল (অনুমোদনের অপেক্ষায়)", step: 2 },
  "delivered": { label: "সফলভাবে ডেলিভারি হয়েছে", step: 3 },
  "partial_delivered": { label: "আংশিক ডেলিভারি হয়েছে", step: 3 },
  "cancelled": { label: "অর্ডারটি বাতিল করা হয়েছে", step: 3 },
  "hold": { label: "অর্ডার হোল্ডে আছে", step: 2 },
  "unknown": { label: "তথ্য পাওয়া যায়নি, সাপোর্টে যোগাযোগ করুন", step: 0 }
};

// কুরিয়ারের স্ট্যাটাস টেক্সটকে আমাদের সিস্টেমের রিডেবল ফরম্যাটে কনভার্ট করার ফাংশন
export const mapCourierStatus = (status) => {
  const lowerStatus = status ? status.toLowerCase() : "unknown";
  return COURIER_STATUSES[lowerStatus] || COURIER_STATUSES["unknown"];
};