import { ZodError } from "zod";
import config from "../config/index.js";
import AppError from "../errors/appError.js";
import handleCastError from "../errors/handleCastError.js";
import handleDuplicateError from "../errors/handleDuplicateError.js";
import handleValidationError from "../errors/handleValidationError.js";
import handleZodError from "../errors/handleZodEror.js";

const globalErrorHandler = (err, req, res, next) => {
  // setting default values

  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources = [
    {
      path: err.path || "", // use the path if provided
      message: "Something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err && err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err && err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err && err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
           path: err.path || "", // use the path if provided
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
           path: err.path || "", // use the path if provided
        message: err.message,
      },
    ];
  }
  const logMessage =
    errorSources?.map((source) => source.message).join(", ") || message;
  req.logError = { message: logMessage };
  // ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    path: logMessage,
    stack: config.node_env === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
