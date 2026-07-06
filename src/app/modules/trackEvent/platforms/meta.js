import crypto from "crypto";

const hash = (value) => {
  if (!value) return undefined;
  return crypto
    .createHash("sha256")
    .update(value.toString().toLowerCase().trim())
    .digest("hex");
};

// ─────────────────────────────────────────────────────────
// Event Name Mapping
// ⚠️ আগে missing events "CustomEvent" হয়ে warning দিচ্ছিল
// ✅ এখন সব events Facebook standard এ map করা
// ─────────────────────────────────────────────────────────
const mapEventNameToMeta = (eventName) => {
  const map = {
    // ── Standard events (আগে থেকেই ছিল) ──────────────────
    page_view:       "PageView",
    view_item:       "ViewContent",
    add_to_cart:     "AddToCart",
    add_to_wishlist: "AddToWishlist",
    begin_checkout:  "InitiateCheckout",
    purchase:        "Purchase",

    // ── এগুলো নতুন যোগ হলো (warning fix) ─────────────────
    select_item:       "ViewContent",      // product card click
    view_cart:         "ViewContent",      // cart page view
    quick_view:        "ViewContent",      // quick view modal
    remove_from_cart:  "InitiateCheckout", // Facebook এ remove নেই
    add_shipping_info: "AddPaymentInfo",   // nearest standard
    add_payment_info:  "AddPaymentInfo",   // exact match
    view_item_list:    "ViewContent",      // product list view
    search:            "Search",
    lead:              "Lead",
    contact:           "Contact",
  };

  const mapped = map[eventName];

  if (!mapped) {
    // Unknown event — "PageView" safe fallback, warning আসবে না
    console.warn(`[Meta CAPI] Unknown event: "${eventName}" → defaulting to PageView`);
    return "PageView";
  }

  return mapped;
};

// ─────────────────────────────────────────────────────────
// Main CAPI Sender
// ─────────────────────────────────────────────────────────
export const sendToMetaCAPI = async (event, metaConfig, userData = {}) => {
  const { pixelId, capiToken, testEventCode } = metaConfig;

  const body = {
    data: [
      {
        event_name:    mapEventNameToMeta(event.eventName),
        event_time:    Math.floor(Date.now() / 1000),
        event_id:      event.eventId,        // ← browser এর same ID → deduplication
        action_source: "website",

        user_data: {
          // Browser info — NOT hashed
          client_ip_address: userData.ip        || null,
          client_user_agent: userData.userAgent  || null,
          fbp:               userData.fbp        || null,
          fbc:               userData.fbc        || null,

          // Personal info — SHA-256 hashed
          em:      hash(userData.email),
          ph:      hash(normalizePhone(userData.phone)),
          fn:      hash(userData.firstName),
          ln:      hash(userData.lastName),
          ct:      hash(userData.city),
          country: hash("bd"),   // Bangladesh fixed
        },

        custom_data: {
          currency:    event.currency  || "BDT",
          value:       event.value     || 0,
          order_id:    event.orderId,
          num_items:   event.items?.length || 1,
          content_ids: event.items?.map((i) => i.product?.toString()).filter(Boolean) || [],
          contents:    event.items?.map((i) => ({
            id:         i.product?.toString(),
            quantity:   i.quantity  || 1,
            item_price: i.price     || 0,
          })) || [],
        },
      },
    ],
    ...(testEventCode && { test_event_code: testEventCode }),
  };

  // null/undefined fields clean করো — Facebook এ empty field পাঠালে quality কমে
  body.data[0].user_data  = cleanObject(body.data[0].user_data);
  body.data[0].custom_data = cleanObject(body.data[0].custom_data);

  const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${capiToken}`;

  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Meta CAPI Error: ${JSON.stringify(err)}`);
  }

  return res.json();
};

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

// Phone normalize: 01XXXXXXXXX → 8801XXXXXXXXX
const normalizePhone = (phone) => {
  if (!phone) return null;
  let p = String(phone).replace(/[\s\-().+]/g, "");
  if (p.startsWith("01") && p.length === 11) p = "880" + p.slice(1);
  if (p.startsWith("+")) p = p.slice(1);
  return p;
};

// null/undefined/empty array remove করো
const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v === null || v === undefined) return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    })
  );
};


// import crypto from "crypto";

// const hash = (value) => {
//   if (!value) return undefined;
//   return crypto
//     .createHash("sha256")
//     .update(value.toString().toLowerCase().trim())
//     .digest("hex");
// };

// export const sendToMetaCAPI = async (event, metaConfig, userData = {}) => {
//   const { pixelId, capiToken, testEventCode } = metaConfig;

//   const body = {
//     data: [
//       {
//         event_name:    mapEventNameToMeta(event.eventName),
//         event_time:    Math.floor(Date.now() / 1000),
//         event_id:      event.eventId,
//         action_source: "website",

//         user_data: {
//           // Browser info
//           client_ip_address: userData.ip        || null,
//           client_user_agent: userData.userAgent  || null,
//           fbp:               userData.fbp        || null,
//           fbc:               userData.fbc        || null,

//           // Personal info — hashed
//           em:      hash(userData.email),
//           ph:      hash(userData.phone),
//           fn:      hash(userData.firstName),   // ✅ নতুন
//           ln:      hash(userData.lastName),    // ✅ নতুন
//           ct:      hash(userData.city),        // ✅ নতুন
//           country: hash("bd"),                 // ✅ নতুন — fixed
//         },

//         custom_data: {
//           currency:    event.currency || "BDT",
//           value:       event.value    || 0,
//           order_id:    event.orderId,
//           num_items:   event.items?.length || 1,                          // ✅ নতুন
//           content_ids: event.items?.map((i) => i.product?.toString()) || [], // ✅ নতুন
//           contents:    event.items?.map((i) => ({                         // ✅ নতুন
//             id:         i.product?.toString(),
//             quantity:   i.quantity,
//             item_price: i.price,
//           })) || [],
//         },
//       },
//     ],
//     ...(testEventCode && { test_event_code: testEventCode }),
//   };

//   const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${capiToken}`;

//   const res = await fetch(url, {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body:    JSON.stringify(body),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(`Meta CAPI Error: ${JSON.stringify(err)}`);
//   }

//   return res.json();
// };

// const mapEventNameToMeta = (eventName) => {
//   const map = {
//     page_view:       "PageView",
//     view_item:       "ViewContent",
//     add_to_cart:     "AddToCart",
//     add_to_wishlist: "AddToWishlist",
//     begin_checkout:  "InitiateCheckout",
//     purchase:        "Purchase",
//   };
//   return map[eventName] || "CustomEvent";
// };