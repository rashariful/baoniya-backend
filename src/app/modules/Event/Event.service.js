
import { Event } from "./Event.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createEvent = async (payload) => {
    const result = await Event.create(payload);
    return result;
}
const getAllEvent = async (query) => {
    const EventSearchableFields = [];
    const resultQuery = new QueryBuilder(Event.find(), query).search(EventSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleEvent = async (id) => {
    const result = await Event.findById(id);
    return result;
}
const updateEvent = async (id, payload) => {
    const result = await Event.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteEvent = async (id) => {
    const result = await Event.findByIdAndDelete(id);
    return result;
}

export const EventServices = {
    createEvent,
    getAllEvent,
    getSingleEvent,
    updateEvent,
    deleteEvent
}
