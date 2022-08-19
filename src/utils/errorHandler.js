const errors = require("../static/error.json");

const errorHandler = (message) => {
  const errorCode = Number(message);
  const string = message
    ? message.toString()
    : "Oops! An error occurred somewhere. Please try again later.";
  const networkTimeout =
    "Dear Customer, we are unable to complete your request at the moment. Please try again later.";
  const checkMatch = errors.filter((item) => item.technicalError === string);
  if (checkMatch.length) {
    return checkMatch[0].customerMessage;
  }
  if (string.match(/does not exist*/)) {
    return string;
  }
  if (string.match(/network timeout*/)) {
    return networkTimeout;
  }
  if (errorCode && errorCode >= 500) {
    return "Sorry we are experiencing a technical problem. Please try again later.";
  }
  // trust the message. always pass the customer message here
  return message;
};

module.exports = errorHandler;
