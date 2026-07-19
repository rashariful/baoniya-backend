// utils/timeFormatter.js

// Full date+time -> "2026-07-18 07:52:05 PM" (BD time)
export const formatToBDTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

// Only date -> "2026-07-18"
export const formatToBDDate = (date) => {
  return new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Dhaka",
  }); // en-CA gives YYYY-MM-DD format
};