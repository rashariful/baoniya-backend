const handleZodError = (err) => {
  const statusCode = 400;
  const errorSources = err.issues.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: `Field: ${issue?.path[issue.path.length - 1]}, ${issue.message}`,
    };
  });

  return {
    statusCode,
    message: "Zod Validation error",
    errorSources,
  };
};

export default handleZodError;
