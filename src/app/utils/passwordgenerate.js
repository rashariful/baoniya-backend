import crypto from "crypto";

// Fisher-Yates shuffle, crypto-safe
const secureShuffle = (str) => {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
};

export const generatePassword = (length = 10) => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const number = "23456789";
  const symbol = "@#$%&*";

  const all = upper + lower + number + symbol;

  let password = "";
  password += upper[crypto.randomInt(upper.length)];
  password += lower[crypto.randomInt(lower.length)];
  password += number[crypto.randomInt(number.length)];
  password += symbol[crypto.randomInt(symbol.length)];

  while (password.length < length) {
    password += all[crypto.randomInt(all.length)];
  }

  return secureShuffle(password);
};