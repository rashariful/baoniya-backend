const handleValidationError = (err) => {
  const errorSources = Object.values(err.errors).map((val) => {
    return {
      path: val.path[val.path.length - 1],
      message: `Field: ${val.path[val.path.length - 1]}, ${val.message}`,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation error",
    errorSources,
  };
};

export default handleValidationError;
