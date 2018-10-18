const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.mostEmbarassingSong = isEmpty(data.mostEmbarassingSong)
    ? ""
    : data.mostEmbarassingSong;

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (isEmpty(data.mostEmbarassingSong)) {
    errors.mostEmbarassingSong =
      "* which song from your Spotify playlist makes you blush";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
