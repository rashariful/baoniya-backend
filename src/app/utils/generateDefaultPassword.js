// utils/generateDefaultPassword.js

const rolePrefixMap = {
  student: "std",
  teacher: "tch",
  guardian: "grd",
  admin: "adm",
  manager: "mgr",
  accountant: "acc",
  librarian: "lib",
  staff: "stf",
  superAdmin: "sad",
};

const generateDefaultPassword = (role, phone) => {
  const prefix = rolePrefixMap[role] || "baoniya";

  // phone er last 6 digit nao (jodi phone e '01712345678' hoy, last 6 = '345678')
  const last6Digits = phone.replace(/\D/g, "").slice(-6);

  return `${prefix}${last6Digits}`;
  // Example: std345678, tch345678
};

export default generateDefaultPassword;