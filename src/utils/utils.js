export const limitDecimals = num => {
  let numToStr = num.toString();
  return numToStr.length > 7
    ? parseFloat(numToStr.substring(-1, 7))
    : parseFloat(numToStr);
};
