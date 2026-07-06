
import { Contact } from "./Contact.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createContact = async (payload) => {
    const result = await Contact.create(payload);
    return result;
}
const getAllContact = async (query) => {
    const ContactSearchableFields = [];
    const resultQuery = new QueryBuilder(Contact.find(), query).search(ContactSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleContact = async (id) => {
    const result = await Contact.findById(id);
    return result;
}
const updateContact = async (id, payload) => {
    const result = await Contact.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteContact = async (id) => {
    const result = await Contact.findByIdAndDelete(id);
    return result;
}

export const ContactServices = {
    createContact,
    getAllContact,
    getSingleContact,
    updateContact,
    deleteContact
}
