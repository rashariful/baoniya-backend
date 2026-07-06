/* eslint-disable no-unused-vars */

const handleDuplicateError = (err) => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];

  const errorSources = [
    {
      path: "",
      message: `${extractedMessage} already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Duplicate field value",
    errorSources,
  };
};

export default handleDuplicateError;
