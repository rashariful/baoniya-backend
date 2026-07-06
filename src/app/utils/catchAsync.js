const catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error.message)
      next(error.message);
    }
  };
};

export default catchAsync;


// const catchAsync = (res, statusCode, success, message, data = null) => {
//   res.status(statusCode).json({ success, message, data });
// };

// export default catchAsync;
