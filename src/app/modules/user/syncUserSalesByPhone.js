// import { Sales } from "../../modules/sales/sales.model.js";

import { Sales } from "../sales/sales.model.js";

export const syncUserSalesByPhone = async (userId, phone) => {
  if (!phone) return;

  await Sales.updateMany(
    { "customer.number": phone },
    {
      $set: {
        user: userId,
      },
    }
  );
};