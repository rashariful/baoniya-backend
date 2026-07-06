export const sendToTikTok = async (event, tiktokConfig) => {
  const { pixelId, eventsToken } = tiktokConfig;

  const body = {
    pixel_code: pixelId,
    event:      mapEventNameToTikTok(event.eventName),
    event_id:   event.eventId,  // ✅ deduplication
    timestamp:  new Date().toISOString(),
    properties: {
      currency: event.currency || "BDT",
      value:    event.value || 0,
      order_id: event.orderId,
    },
  };

  const res = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Access-Token":  eventsToken,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`TikTok Error: ${JSON.stringify(err)}`);
  }

  return res.json();
};

const mapEventNameToTikTok = (eventName) => {
  const map = {
    page_view:       "Pageview",
    view_item:       "ViewContent",
    add_to_cart:     "AddToCart",
    add_to_wishlist: "AddToWishlist",
    begin_checkout:  "InitiateCheckout",
    purchase:        "PlaceAnOrder",
  };
  return map[eventName] || eventName;
};