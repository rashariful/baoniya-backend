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