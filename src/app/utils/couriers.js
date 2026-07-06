import axios from "axios";

const handleRxCourier = async ({ order, courierConfig }) => {
  const { url, email, password, api_key } = courierConfig;
  const customer = order.customer || {};

  // RX sig in here function
  const authRes = await axios.post(
    `${url}/merchant/signin`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        apiKey: api_key,
      },
    }
  );

  // Get auth token here
  const authToken = authRes?.data?.data?.auth_token;
  if (!authToken) throw new Error("RX Auth failed");

  // delivery data here
  const deliveryData = {
    category_id: "1",
    pickup_shop_name: "Icchaporon",
    pickup_phone: email,
    pickup_address:
      order.pickupAddress || "House-08, Road-05 Nikunja-02 Dhaka-1229",
    weight: order.weight || 1,
    delivery_type_id: order.deliveryType || 0,
    invoice_no: order.orderId || "",
    customer_name: customer.name || "",
    customer_address: customer.address || "",
    customer_phone: customer.number || "",
    cash_collection: order.due || 0,
    merchantType: "1",
    fragileLiquid: order.isFragile ? "1" : "",
    note: order.message || "N/A",
  };

  // create response here
  const response = await axios.post(`${url}/parcel-create`, deliveryData, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      api_key,
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.data?.success || !response.data.data?.parcel?.tracking_id) {
    throw new Error("RX Parcel creation failed");
  }

  return response.data.data.parcel.tracking_id;
};

const handleSteadfastCourier = async ({ order, courierConfig }) => {
  // console.log(order, "order infor")
  const { url, api_key, secret_key } = courierConfig;
  const customer = order.customer || {};


  const deliveryData = {
    invoice: order.orderId,
    recipient_name: customer.name,
    recipient_phone: customer.number,
    alternative_phone: customer.alt_number || "",
    recipient_email: customer.email || "",
    recipient_address: customer.address,
    cod_amount: order.due,
    note: order?.note || "N/A",
    item_description:
      order.products
        ?.map((p) => p?.product?.name)
        .filter(Boolean)
        .join(", ") || "N/A",

    total_lot: order.products?.length,
    delivery_type: order.deliveryType || 0,
  };

  const response = await axios.post(`${url}/create_order`, deliveryData, {
    headers: {
      "Content-Type": "application/json",
      "Api-Key": api_key,
      "Secret-Key": secret_key,
    },
  });

  // console.log(response, "response here stead fast")

  if (!response.data?.consignment?.tracking_code) {
    throw new Error("Steadfast Parcel creation failed");
  }

  return response.data.consignment.tracking_code;
};

export const Courier = {
  handleSteadfastCourier,
  handleRxCourier,
};
