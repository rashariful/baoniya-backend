import { Notice } from "./Notice.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.js";

// Declare the Services 

const createNotice = async (file, payload) => {
  try {
    if (file?.buffer) {
      const imageName = `notice_${Date.now()}`;
      const { secure_url } = await sendImageToCloudinary(
        imageName,
        file.buffer
      );
      payload.thumbnail = secure_url;
    }

    const result = await Notice.create(payload);
    return result;
  } catch (error) {
    console.error("Failed to create notice:", error);
    throw new Error("Failed to create notice: " + error.message);
  }
}

const getAllNotice = async (query) => {
    const NoticeSearchableFields = ['title', 'message'];
    const resultQuery = new QueryBuilder(Notice.find(), query).search(NoticeSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}

const getSingleNotice = async (id) => {
    const result = await Notice.findById(id);
    return result;
}

const updateNotice = async (id, file, payload) => {
  try {
    if (file?.buffer) {
      const imageName = `notice_${Date.now()}`;
      const { secure_url } = await sendImageToCloudinary(
        imageName,
        file.buffer
      );
      payload.thumbnail = secure_url;
    }

    const result = await Notice.findByIdAndUpdate(id, payload, { 
      new: true, 
      runValidators: true 
    });

    if (!result) {
      throw new Error("Notice not found");
    }

    return result;
  } catch (error) {
    console.error("Failed to update notice:", error);
    throw new Error("Failed to update notice: " + error.message);
  }
}

const deleteNotice = async (id) => {
    const result = await Notice.findByIdAndDelete(id);
    return result;
}

export const NoticeServices = {
    createNotice,
    getAllNotice,
    getSingleNotice,
    updateNotice,
    deleteNotice
}