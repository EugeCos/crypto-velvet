import { GET_SCREEN_WIDTH } from "./types";

export const getScreenWidth = screenWidth => {
  return {
    type: GET_SCREEN_WIDTH,
    payload: screenWidth
  };
};
