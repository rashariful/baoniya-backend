import { Report } from "./report.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services

const createReport = async (payload) => {
  const result = await Report.create(payload);
  return result;
};
const getAllReport = async (query) => {
  const reportSearchableFields = [];
  const resultQuery = new QueryBuilder(Report.find(), query)
    .search(reportSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();
  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();

  return {
    data: result,
    meta,
  };
};
const getSingleReport = async (id) => {
  const result = await Report.findById(id);
  return result;
};
const updateReport = async (id, payload) => {
  const result = await Report.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  return result;
};
const deleteReport = async (id) => {
  const result = await Report.findByIdAndDelete(id);
  return result;
};

import { Sales } from "../sales/sales.model.js";
import { OrderReturn } from "../orderReturn/orderReturn.model.js";
import { Purchase } from "../purchase/purchase.model.js";
import { ProductReturn } from "../productReturn/productReturn.model.js";

// const getFinancialReport = async () => {
//   const [sales] = await Sales.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]);

//   // console.log(sales) 

//   // console.log(sales, "total sales amount");
//   const [salesReturn] = await OrderReturn.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]);
//   // console.log(salesReturn, "total order return amount");

//   const [purchases] = await Purchase.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]);
//   // console.log(purchases, "purchase")

//   const [purchaseReturn] = await ProductReturn.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]);
//   // console.log(purchaseReturn, "product return")



//   // console.log(sales, "total sales", purchases, "total purchase", )
// const sal = (purchases - sales)
// console.log(sal)
//   const income = (sales?.total || 0) - (salesReturn?.total || 0);
//   const expense = (purchases?.total || 0) - (purchaseReturn?.total || 0);
//   const profit = income - expense;
//   // console.log(income, "total income");
//   return {
//     income,
//     expense,
//     profit,
//   };
// };


const getFinancialReport = async () => {
  // Updated: Calculate sales from products array
  const sales = await Sales.find();
  let totalSalesAmount = 0;

  sales.forEach((sale) => {
    if (Array.isArray(sale.products)) {
      sale.products.forEach((product) => {
        totalSalesAmount += product.total || 0;
      });
    }
  });

  // Other parts remain same
  const [salesReturn] = await OrderReturn.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);

  const [purchases] = await Purchase.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);

  const [purchaseReturn] = await ProductReturn.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);

  const income = totalSalesAmount - (salesReturn?.total || 0);
  const expense = (purchases?.total || 0) - (purchaseReturn?.total || 0);
  const profit = income - expense;

  return {
    income,
    expense,
    profit,
  };
};

// import Purchase from "../models/Purchase.js";
// import Sales from "../models/Sales.js";

// const getSalesAndPurchaseSummary = async () => {
//   const purchases = await Purchase.find();
//   const sales = await Sales.find();

//   let totalPurchasedQuantity = 0;
//   let totalPurchaseValue = 0;

//   purchases.forEach((purchase) => {
//     totalPurchasedQuantity += purchase.quantity || 0;
//     totalPurchaseValue += purchase.quantity * purchase.price || 0;
//   });

//   let totalSoldQuantity = 0;
//   let totalSalesValue = 0;

//   sales.forEach((sale) => {
//     totalSoldQuantity += sale.quantity || 0;
//     totalSalesValue += sale.totalPrice || 0;
//   });

//   const remainingValue = totalSalesValue - totalPurchaseValue;
//   const unsoldQuantity = totalPurchasedQuantity - totalSoldQuantity;

//   return {
//     totalPurchasedQuantity,
//     totalPurchaseValue,
//     totalSoldQuantity,
//     totalSalesValue,
//     remainingValue,
//     unsoldQuantity,
//   };
// };



const getSalesAndPurchaseSummary = async () => {
  const purchases = await Purchase.find();
  const sales = await Sales.find();

  let totalPurchasedQuantity = 0;
  let totalPurchaseValue = 0;

 

  purchases.forEach((purchase) => {
    totalPurchasedQuantity += purchase.quantity || 0;
    totalPurchaseValue += (purchase.quantity || 0) * (purchase.price || 0);
  });


  let totalSoldQuantity = 0;
  let totalSalesValue = 0;

  sales.forEach((sale) => {
    if (Array.isArray(sale.products)) {
      sale.products.forEach((product) => {
        totalSoldQuantity += product.qty || 0;
        totalSalesValue += product.total || 0;
      });
    }
  });

  const remainingValue = totalSalesValue - totalPurchaseValue;
  const unsoldQuantity = totalPurchasedQuantity - totalSoldQuantity;

  return {
    totalPurchasedQuantity,
    totalPurchaseValue,
    totalSoldQuantity,
    totalSalesValue,
    remainingValue,
    unsoldQuantity,
  };
};

//     totalPurchasedQuantity,
//     totalPurchaseValue,
//     totalSoldQuantity,
//     totalSalesValue,
//     remainingValue,
//     unsoldQuantity,

export const ReportServices = {
  createReport,
  getAllReport,
  getSingleReport,
  updateReport,
  deleteReport,
  getFinancialReport,
  getSalesAndPurchaseSummary,
};
