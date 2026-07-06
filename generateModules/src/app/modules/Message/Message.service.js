
import { Message } from "./Message.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createMessage = async (payload) => {
    const result = await Message.create(payload);
    return result;
}
const getAllMessage = async (query) => {
    const MessageSearchableFields = [];
    const resultQuery = new QueryBuilder(Message.find(), query).search(MessageSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleMessage = async (id) => {
    const result = await Message.findById(id);
    return result;
}
const updateMessage = async (id, payload) => {
    const result = await Message.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteMessage = async (id) => {
    const result = await Message.findByIdAndDelete(id);
    return result;
}

export const MessageServices = {
    createMessage,
    getAllMessage,
    getSingleMessage,
    updateMessage,
    deleteMessage
}
