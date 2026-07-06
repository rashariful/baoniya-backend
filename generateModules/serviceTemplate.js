const serviceTemplate = `
import { {{uppercaseFileName}} } from "./{{lowercaseFileName}}.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const create{{uppercaseFileName}} = async (payload) => {
    const result = await {{uppercaseFileName}}.create(payload);
    return result;
}
const getAll{{uppercaseFileName}} = async (query) => {
    const {{lowercaseFileName}}SearchableFields = [];
    const resultQuery = new QueryBuilder({{uppercaseFileName}}.find(), query).search({{lowercaseFileName}}SearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingle{{uppercaseFileName}} = async (id) => {
    const result = await {{uppercaseFileName}}.findById(id);
    return result;
}
const update{{uppercaseFileName}} = async (id, payload) => {
    const result = await {{uppercaseFileName}}.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const delete{{uppercaseFileName}} = async (id) => {
    const result = await {{uppercaseFileName}}.findByIdAndDelete(id);
    return result;
}

export const {{uppercaseFileName}}Services = {
    create{{uppercaseFileName}},
    getAll{{uppercaseFileName}},
    getSingle{{uppercaseFileName}},
    update{{uppercaseFileName}},
    delete{{uppercaseFileName}}
}
`;

export default serviceTemplate;
