export const sendToGA4 = async (event, ga4Config) => {
  const { measurementId, apiSecret } = ga4Config;

  const body = {
    client_id: event.storeId.toString(), // anonymized
    events: [
      {
        name:   event.eventName,
        params: {
          currency:        event.currency || "BDT",
          value:           event.value || 0,
          transaction_id:  event.orderId,
          engagement_time_msec: 100,
        },
      },
    ],
  };

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  // GA4 সবসময় 204 দেয়, body থাকে না
  if (!res.ok && res.status !== 204) {
    throw new Error(`GA4 Error: ${res.status}`);
  }

  return { status: "sent" };
};