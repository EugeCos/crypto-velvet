const isEmpty = value =>
  // arrow functions don't need return statements or curly braces if there is only one line after the arrow
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0); // .trim() removes empty space in a String

module.exports = isEmpty;
