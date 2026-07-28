// import axios from "axios";
// import DigestFetch from "digest-fetch";
// import { Device } from "../Device/Device.model.js";
// // import { Device } from "../Device/Device.model.js";

// // Ekta device-er info diye client banano (multi-device support)
// const getClient = async (deviceId) => {
//   const device = await Device.findOne({ deviceId });
//   if (!device) throw new Error(`Device not found: ${deviceId}`);

//   const client = new DigestFetch(device.username, device.password);
//   const baseUrl = `http://${device.ip}:${device.port}`;

//   return { client, baseUrl, device };
// };

// // User create
// export const createHikvisionUser = async (deviceId, { employeeNo, name }) => {
//   const { client, baseUrl } = await getClient(deviceId);

//   const body = {
//     UserInfo: {
//       employeeNo,
//       name,
//       userType: "normal",
//       Valid: {
//         enable: true,
//         beginTime: "2024-01-01T00:00:00",
//         endTime: "2034-12-31T23:59:59",
//       },
//     },
//   };

//   const res = await client.fetch(
//     `${baseUrl}/ISAPI/AccessControl/UserInfo/Record?format=json`,
//     {
//       method: "PUT",
//       body: JSON.stringify(body),
//     }
//   );

//   const data = await res.json();
//   if (data.statusCode !== 1) {
//     throw new Error(`Hikvision create failed: ${data.errorMsg || JSON.stringify(data)}`);
//   }
//   return data;
// };

// // User update
// export const updateHikvisionUser = async (deviceId, { employeeNo, name }) => {
//   const { client, baseUrl } = await getClient(deviceId);

//   const body = {
//     UserInfo: { employeeNo, name },
//   };

//   const res = await client.fetch(
//     `${baseUrl}/ISAPI/AccessControl/UserInfo/Modify?format=json`,
//     { method: "PUT", body: JSON.stringify(body) }
//   );

//   const data = await res.json();
//   if (data.statusCode !== 1) {
//     throw new Error(`Hikvision update failed: ${data.errorMsg || JSON.stringify(data)}`);
//   }
//   return data;
// };

// // User delete
// export const deleteHikvisionUser = async (deviceId, { employeeNo }) => {
//   const { client, baseUrl } = await getClient(deviceId);

//   const body = {
//     UserInfoDetail: {
//       mode: "byEmployeeNo",
//       EmployeeNoList: [{ employeeNo }],
//     },
//   };

//   const res = await client.fetch(
//     `${baseUrl}/ISAPI/AccessControl/UserInfo/Delete?format=json`,
//     { method: "PUT", body: JSON.stringify(body) }
//   );

//   const data = await res.json();
//   if (data.statusCode !== 1) {
//     throw new Error(`Hikvision delete failed: ${data.errorMsg || JSON.stringify(data)}`);
//   }
//   return data;
// };



import DigestFetch from "digest-fetch";

const DEVICE_IP = process.env.HIK_DEVICE_IP;
const DEVICE_USER = process.env.HIK_DEVICE_USER;
const DEVICE_PASS = process.env.HIK_DEVICE_PASS;

const client = new DigestFetch(DEVICE_USER, DEVICE_PASS);

// Hikvision date format: YYYY-MM-DDTHH:mm:ss+06:00
const formatHikTime = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}+06:00`;
};

export const fetchAcsEvents = async ({
  startTime,
  endTime,
  searchPosition = 0,
  maxResults = 30,
}) => {
  const url = `http://${DEVICE_IP}/ISAPI/AccessControl/AcsEvent?format=json`;

  if (startTime instanceof Date) startTime = formatHikTime(startTime);
  if (endTime instanceof Date) endTime = formatHikTime(endTime);

  const body = {
    AcsEventCond: {
      searchID: "1",
      searchResultPosition: searchPosition,
      maxResults,
      major: 5, // ✅ shudhu access-control related event
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

  console.log("========== RESPONSE STATUS ==========", res.status);

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

  // ✅ Consistent object return - সবসময় events, totalMatches, hasMore থাকবে
  return {
    events: data?.AcsEvent?.InfoList || [],
    totalMatches: data?.AcsEvent?.totalMatches || 0,
    hasMore: data?.AcsEvent?.responseStatusStrg === "MORE",
  };
};