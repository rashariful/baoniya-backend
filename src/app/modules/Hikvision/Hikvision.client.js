import DigestFetch from "digest-fetch";

const DEVICE_IP = process.env.HIK_DEVICE_IP;
const DEVICE_USER = process.env.HIK_DEVICE_USER;
const DEVICE_PASS = process.env.HIK_DEVICE_PASS;

const client = new DigestFetch(DEVICE_USER, DEVICE_PASS);

// Hikvision date format: YYYY-MM-DDTHH:mm:ss
const formatHikTime = (date) => {
  const pad = (n) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
};

export const fetchAcsEvents = async ({
  startTime,
  endTime,
  searchPosition = 0,
  maxResults = 30,
}) => {
  const url = `http://${DEVICE_IP}/ISAPI/AccessControl/AcsEvent?format=json`;

  // যদি Date object আসে তাহলে format করে নেবে
  if (startTime instanceof Date) {
    startTime = formatHikTime(startTime);
  }

  if (endTime instanceof Date) {
    endTime = formatHikTime(endTime);
  }

  const body = {
    AcsEventCond: {
      searchID: "1",
      searchResultPosition: searchPosition,
      maxResults,
      major: 0,
      minor: 0,
      startTime,
      endTime,
    },
  };

  console.log("========== REQUEST ==========");
  console.log(JSON.stringify(body, null, 2));

  const res = await client.fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log("========== RESPONSE ==========");
  console.log("Status:", res.status);
  console.log("Content-Type:", res.headers.get("content-type"));

  const text = await res.text();

  console.log(text);

  if (!res.ok) {
    throw new Error(`Hikvision Error (${res.status}): ${text}`);
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error(`Invalid JSON Response: ${text}`);
  }

  console.log("========== PARSED ==========");
  console.log(JSON.stringify(data, null, 2));

  return data?.AcsEvent?.InfoList || [];
};

// import DigestFetch from "digest-fetch";

// const DEVICE_IP = process.env.HIK_DEVICE_IP;
// const DEVICE_USER = process.env.HIK_DEVICE_USER;
// const DEVICE_PASS = process.env.HIK_DEVICE_PASS;

// const client = new DigestFetch(DEVICE_USER, DEVICE_PASS);

// export const fetchAcsEvents = async ({ startTime, endTime, searchPosition = 0, maxResults = 30 }) => {
//   const url = `http://${DEVICE_IP}/ISAPI/AccessControl/AcsEvent?format=json`;

//   const body = {
//     AcsEventCond: {
//       searchID: "1",
//       searchResultPosition: searchPosition,
//       maxResults,
//       major: 0,
//       minor: 0,
//       startTime,
//       endTime,
//     },
//   };

//   const res = await client.fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   const data = await res.json();
//   return data?.AcsEvent?.InfoList || [];
// };