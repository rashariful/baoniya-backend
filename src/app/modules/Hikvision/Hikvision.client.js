import DigestFetch from "digest-fetch";
import { Device } from "../Device/Device.model.js";

const getClient = async (deviceId) => {
  const device = await Device.findOne({ deviceId });
  if (!device) throw new Error(`Device not found: ${deviceId}`);

  const client = new DigestFetch(device.username, device.password);
  const baseUrl = `http://${device.ip}:${device.port}`;

  return { client, baseUrl, device };
};

// Teacher ID (e.g. "TCH-26-0023-7") theke shudhu numbers ber kora
const toNumericEmployeeNo = (teacherId) => {
  const numericOnly = teacherId.replace(/\D/g, "");
  if (!numericOnly) {
    throw new Error(`Cannot derive numeric employeeNo from teacherId: ${teacherId}`);
  }
  return numericOnly;
};

// ---------------------------------------------------------
// 1. Fetch ACS Events (Attendance Logs Pull from Device)
// ---------------------------------------------------------
export const fetchAcsEvents = async ({
  deviceId,
  startTime,
  endTime,
  searchPosition = 0,
  maxResults = 30,
}) => {
  const device = deviceId
    ? await Device.findOne({ deviceId })
    : await Device.findOne();

  if (!device) throw new Error("No Hikvision device found for sync");

  const { client, baseUrl } = await getClient(device.deviceId);

  const payload = {
    AcsEventCond: {
      searchID: "1",
      searchPosition,
      maxResults,
      major: 5,
      minor: 75,
      startTime: startTime.toISOString().split(".")[0],
      endTime: endTime.toISOString().split(".")[0],
    },
  };

  const res = await client.fetch(
    `${baseUrl}/ISAPI/AccessControl/AcsEvent?format=json`,
    { method: "POST", body: JSON.stringify(payload) }
  );

  const rawText = await res.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    throw new Error(
      `Non-JSON response from device during event fetch (status ${res.status}): ${rawText}`
    );
  }

  const events = data?.AcsEvent?.InfoList || [];
  const totalMatches = data?.AcsEvent?.totalMatches || 0;
  const hasMore = searchPosition + events.length < totalMatches;

  return {
    deviceId: device.deviceId,
    events,
    hasMore,
    totalMatches,
  };
};

// ---------------------------------------------------------
// 2. User Create
// ---------------------------------------------------------
export const createHikvisionUser = async (
  deviceId,
  { employeeNo, name, gender, joinDate }
) => {
  const { client, baseUrl } = await getClient(deviceId);

  const numericEmployeeNo = toNumericEmployeeNo(employeeNo);

  // Teacher schema: "Male" | "Female" | "Other" -> Hikvision: "male" | "female" | "unknown"
  const genderMap = { Male: "male", Female: "female", Other: "unknown" };
  const hikGender = genderMap[gender] || "unknown";

  // joinDate na dile aajker date fallback, 10 bochor validity
  const beginDate = joinDate ? new Date(joinDate) : new Date();
  const beginTime = beginDate.toISOString().split(".")[0];

  const endDate = new Date(beginDate);
  endDate.setFullYear(endDate.getFullYear() + 10);
  const endTime = endDate.toISOString().split(".")[0];

  const body = {
    UserInfo: {
      employeeNo: numericEmployeeNo,
      name,
      userType: "normal",
      gender: hikGender,
      Valid: {
        enable: true,
        beginTime,
        endTime,
      },
    },
  };

  const res = await client.fetch(
    `${baseUrl}/ISAPI/AccessControl/UserInfo/Record?format=json`,
    { method: "POST", body: JSON.stringify(body) }
  );

  const rawText = await res.text();
  console.log("=== HIKVISION CREATE RAW RESPONSE ===");
  console.log("HTTP Status:", res.status);
  console.log("Body:", rawText);
  console.log("======================================");

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    throw new Error(`Non-JSON response from device (status ${res.status}): ${rawText}`);
  }

  if (data.statusCode !== 1) {
    throw new Error(`Hikvision create failed: ${JSON.stringify(data)}`);
  }

  return { ...data, employeeNo: numericEmployeeNo };
};

// ---------------------------------------------------------
// 3. User Update
// ---------------------------------------------------------
export const updateHikvisionUser = async (deviceId, { employeeNo, name }) => {
  const { client, baseUrl } = await getClient(deviceId);

  const body = {
    UserInfo: { employeeNo, name },
  };

  const res = await client.fetch(
    `${baseUrl}/ISAPI/AccessControl/UserInfo/Modify?format=json`,
    { method: "PUT", body: JSON.stringify(body) }
  );

  const rawText = await res.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    throw new Error(`Non-JSON response from device (status ${res.status}): ${rawText}`);
  }

  if (data.statusCode !== 1) {
    throw new Error(`Hikvision update failed: ${JSON.stringify(data)}`);
  }
  return data;
};

// ---------------------------------------------------------
// 4. User Delete
// ---------------------------------------------------------
export const deleteHikvisionUser = async (deviceId, { employeeNo }) => {
  const { client, baseUrl } = await getClient(deviceId);

  const body = {
    UserInfoDetail: {
      mode: "byEmployeeNo",
      EmployeeNoList: [{ employeeNo }],
    },
  };

  const res = await client.fetch(
    `${baseUrl}/ISAPI/AccessControl/UserInfo/Delete?format=json`,
    { method: "PUT", body: JSON.stringify(body) }
  );

  const rawText = await res.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    throw new Error(`Non-JSON response from device (status ${res.status}): ${rawText}`);
  }

  if (data.statusCode !== 1) {
    throw new Error(`Hikvision delete failed: ${JSON.stringify(data)}`);
  }
  return data;
};

// import DigestFetch from "digest-fetch";
// import { Device } from "../Device/Device.model.js";

// const getClient = async (deviceId) => {
//   const device = await Device.findOne({ deviceId });
//   if (!device) throw new Error(`Device not found: ${deviceId}`);

//   const client = new DigestFetch(device.username, device.password);
//   const baseUrl = `http://${device.ip}:${device.port}`;

//   return { client, baseUrl, device };
// };

// // Teacher ID (e.g. "TCH-26-0023-7") theke shudhu numbers ber kora
// const toNumericEmployeeNo = (teacherId) => {
//   const numericOnly = teacherId.replace(/\D/g, "");
//   if (!numericOnly) {
//     throw new Error(`Cannot derive numeric employeeNo from teacherId: ${teacherId}`);
//   }
//   return numericOnly;
// };

// // ---------------------------------------------------------
// // 1. Fetch ACS Events (Attendance Logs Pull from Device)
// // ---------------------------------------------------------
// export const fetchAcsEvents = async ({
//   deviceId,
//   startTime,
//   endTime,
//   searchPosition = 0,
//   maxResults = 30,
// }) => {
//   // Problem 2 fix: deviceId parameter-e ashe, na dile fallback e prothom device
//   const device = deviceId
//     ? await Device.findOne({ deviceId })
//     : await Device.findOne();

//   if (!device) throw new Error("No Hikvision device found for sync");

//   const { client, baseUrl } = await getClient(device.deviceId);

//   const payload = {
//     AcsEventCond: {
//       searchID: "1",
//       searchPosition,
//       maxResults,
//       major: 5,
//       minor: 75,
//       startTime: startTime.toISOString().split(".")[0],
//       endTime: endTime.toISOString().split(".")[0],
//     },
//   };

//   const res = await client.fetch(
//     `${baseUrl}/ISAPI/AccessControl/AcsEvent?format=json`,
//     { method: "POST", body: JSON.stringify(payload) }
//   );

//   const rawText = await res.text();
//   let data;
//   try {
//     data = JSON.parse(rawText);
//   } catch (e) {
//     throw new Error(
//       `Non-JSON response from device during event fetch (status ${res.status}): ${rawText}`
//     );
//   }

//   const events = data?.AcsEvent?.InfoList || [];
//   const totalMatches = data?.AcsEvent?.totalMatches || 0;
//   // Problem 3 fix: events.length diye position barano, fixed 30 na
//   const hasMore = searchPosition + events.length < totalMatches;

//   return {
//     deviceId: device.deviceId, // Problem 2 fix: caller-ke device identity return kora
//     events,
//     hasMore,
//     totalMatches,
//   };
// };

// // ---------------------------------------------------------
// // 2. User Create
// // ---------------------------------------------------------
// export const createHikvisionUser = async (deviceId, { employeeNo, name }) => {
//   const { client, baseUrl } = await getClient(deviceId);

//   const numericEmployeeNo = toNumericEmployeeNo(employeeNo);

//   const body = {
//     UserInfo: {
//       employeeNo: numericEmployeeNo,
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
//     { method: "POST", body: JSON.stringify(body) }
//   );

//   const rawText = await res.text();
//   let data;
//   try {
//     data = JSON.parse(rawText);
//   } catch (e) {
//     throw new Error(`Non-JSON response from device (status ${res.status}): ${rawText}`);
//   }

//   if (data.statusCode !== 1) {
//     throw new Error(`Hikvision create failed: ${JSON.stringify(data)}`);
//   }

//   // Problem 1 fix: numeric employeeNo-i return kora hocche, jate caller eta deviceUserId hishebe save kore
//   return { ...data, employeeNo: numericEmployeeNo };
// };

// // ---------------------------------------------------------
// // 3. User Update
// // ---------------------------------------------------------
// export const updateHikvisionUser = async (deviceId, { employeeNo, name }) => {
//   const { client, baseUrl } = await getClient(deviceId);

//   const body = {
//     UserInfo: { employeeNo, name },
//   };

//   const res = await client.fetch(
//     `${baseUrl}/ISAPI/AccessControl/UserInfo/Modify?format=json`,
//     { method: "PUT", body: JSON.stringify(body) }
//   );

//   const rawText = await res.text();
//   let data;
//   try {
//     data = JSON.parse(rawText);
//   } catch (e) {
//     throw new Error(`Non-JSON response from device (status ${res.status}): ${rawText}`);
//   }

//   if (data.statusCode !== 1) {
//     throw new Error(`Hikvision update failed: ${JSON.stringify(data)}`);
//   }
//   return data;
// };

// // ---------------------------------------------------------
// // 4. User Delete
// // ---------------------------------------------------------
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

//   const rawText = await res.text();
//   let data;
//   try {
//     data = JSON.parse(rawText);
//   } catch (e) {
//     throw new Error(`Non-JSON response from device (status ${res.status}): ${rawText}`);
//   }

//   if (data.statusCode !== 1) {
//     throw new Error(`Hikvision delete failed: ${JSON.stringify(data)}`);
//   }
//   return data;
// };



// import DigestFetch from "digest-fetch";
// import { Device } from "../Device/Device.model.js";

// // Ekta device-er info diye client banano (multi-device support)
// const getClient = async (deviceId) => {
//   const device = await Device.findOne({ deviceId });
//   if (!device) throw new Error(`Device not found: ${deviceId}`);

//   const client = new DigestFetch(device.username, device.password);
//   const baseUrl = `http://${device.ip}:${device.port}`;

//   return { client, baseUrl, device };
// };

// // Helper: Teacher ID (e.g. "TCH-26-0023-7") theke shudhu numbers ber kora
// const toNumericEmployeeNo = (teacherId) => {
//   const numericOnly = teacherId.replace(/\D/g, "");
//   if (!numericOnly) {
//     throw new Error(`Cannot derive numeric employeeNo from teacherId: ${teacherId}`);
//   }
//   return numericOnly;
// };

// // ---------------------------------------------------------
// // 1. Fetch ACS Events (Attendance Logs Pull from Device)
// // ---------------------------------------------------------
// export const fetchAcsEvents = async ({ startTime, endTime, searchPosition = 0, maxResults = 30 }) => {
//   // Amra default device ba prothom active device use korte pari, ba deviceId pass korte pari. 
//   // Ekhane prothom device-er IP/Auth niye pull korchi (Multi-device hole deviceId parameter hisebe pathate paren)
//   const device = await Device.findOne(); 
//   if (!device) throw new Error("No default Hikvision device found for sync");

//   const { client, baseUrl } = await getClient(device.deviceId);

//   const payload = {
//     AcsEventCond: {
//       searchID: "1",
//       searchPosition,
//       maxResults,
//       major: 5, // Access Control Event
//       minor: 75, // Successful Verification / Normal Access
//       startTime: startTime.toISOString().split(".")[0], // Format: YYYY-MM-DDTHH:mm:ss
//       endTime: endTime.toISOString().split(".")[0],
//     },
//   };

//   const res = await client.fetch(
//     `${baseUrl}/ISAPI/AccessControl/AcsEvent?format=json`,
//     {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }
//   );

//   const rawText = await res.text();
//   let data;
//   try {
//     data = JSON.parse(rawText);
//   } catch (e) {
//     throw new Error(`Non-JSON response from device during event fetch (status ${res.status}): ${rawText}`);
//   }

//   // Hikvision Event search result structure: data.AcsEvent.InfoList
//   const events = data?.AcsEvent?.InfoList || [];
//   const totalMatches = data?.AcsEvent?.totalMatches || 0;
//   const hasMore = searchPosition + events.length < totalMatches;

//   return {
//     events,
//     hasMore,
//     totalMatches,
//   };
// };

// // ---------------------------------------------------------
// // 2. User Create
// // ---------------------------------------------------------
// export const createHikvisionUser = async (deviceId, { employeeNo, name }) => {
//   const { client, baseUrl } = await getClient(deviceId);

//   const numericEmployeeNo = toNumericEmployeeNo(employeeNo);

//   const body = {
//     UserInfo: {
//       employeeNo: numericEmployeeNo,
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
//     { method: "POST", body: JSON.stringify(body) }
//   );

//   const rawText = await res.text();
//   console.log("=== HIKVISION CREATE RAW RESPONSE ===");
//   console.log("HTTP Status:", res.status);
//   console.log("Body:", rawText);
//   console.log("======================================");

//   let data;
//   try {
//     data = JSON.parse(rawText);
//   } catch (e) {
//     throw new Error(`Non-JSON response from device (status ${res.status}): ${rawText}`);
//   }

//   if (data.statusCode !== 1) {
//     throw new Error(`Hikvision create failed: ${JSON.stringify(data)}`);
//   }
//   return { ...data, employeeNo: numericEmployeeNo };
// };

// // ---------------------------------------------------------
// // 3. User Update
// // ---------------------------------------------------------
// export const updateHikvisionUser = async (deviceId, { employeeNo, name }) => {
//   const { client, baseUrl } = await getClient(deviceId);

//   const body = {
//     UserInfo: { employeeNo, name },
//   };

//   const res = await client.fetch(
//     `${baseUrl}/ISAPI/AccessControl/UserInfo/Modify?format=json`,
//     { method: "PUT", body: JSON.stringify(body) }
//   );

//   const rawText = await res.text();
//   console.log("=== HIKVISION UPDATE RAW RESPONSE ===");
//   console.log("HTTP Status:", res.status);
//   console.log("Body:", rawText);
//   console.log("======================================");

//   let data;
//   try {
//     data = JSON.parse(rawText);
//   } catch (e) {
//     throw new Error(`Non-JSON response from device (status ${res.status}): ${rawText}`);
//   }

//   if (data.statusCode !== 1) {
//     throw new Error(`Hikvision update failed: ${JSON.stringify(data)}`);
//   }
//   return data;
// };

// // ---------------------------------------------------------
// // 4. User Delete
// // ---------------------------------------------------------
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

//   const rawText = await res.text();
//   console.log("=== HIKVISION DELETE RAW RESPONSE ===");
//   console.log("HTTP Status:", res.status);
//   console.log("Body:", rawText);
//   console.log("======================================");

//   let data;
//   try {
//     data = JSON.parse(rawText);
//   } catch (e) {
//     throw new Error(`Non-JSON response from device (status ${res.status}): ${rawText}`);
//   }

//   if (data.statusCode !== 1) {
//     throw new Error(`Hikvision delete failed: ${JSON.stringify(data)}`);
//   }
//   return data;
// };
