
import { GradeRule } from "./GradeRule.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createGradeRule = async (payload) => {
    const result = await GradeRule.create(payload);
    return result;
}
const getAllGradeRule = async (query) => {
    const GradeRuleSearchableFields = [ "boardType",
  "rules.grade",];
    const resultQuery = new QueryBuilder(GradeRule.find().populate({
        path: "sessionId",
        select: "name year",
      })
      
       .populate({
        path: "applicableClasses",
        select: "name code",
      })

      , query).search(GradeRuleSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}


// const getAllGradeRule = async (query: Record<string, unknown>) => {
//   const resultQuery = new QueryBuilder(
//     GradeRule.find()
//       .populate({
//         path: "sessionId",
//         select: "name year",
//       })
//       .populate({
//         path: "applicableClasses",
//         select: "name code",
//       }),
//     query
//   )
//     .search(GradeRuleSearchableFields)
//     .filter()
//     .sort()
//     .fields()
//     .paginate()
//     .limit();

//   const result = await resultQuery.modelQuery;
//   const meta = await resultQuery.countTotal();

//   return {
//     data: result,
//     meta,
//   };
// };


const getSingleGradeRule = async (id) => {
    const result = await GradeRule.findById(id);
    return result;
}
const updateGradeRule = async (id, payload) => {
    const result = await GradeRule.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteGradeRule = async (id) => {
    const result = await GradeRule.findByIdAndDelete(id);
    return result;
}

export const GradeRuleServices = {
    createGradeRule,
    getAllGradeRule,
    getSingleGradeRule,
    updateGradeRule,
    deleteGradeRule
}
