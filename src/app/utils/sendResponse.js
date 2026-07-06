const sendResponse = (res, data) => {
  return res.status(data.status).json({
    success: data.success,
    message: data.message,
    meta: data?.meta,
    data: data?.data,
  });
};

export default sendResponse;
