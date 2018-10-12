import { GET_SCREEN_WIDTH } from "../actions/types";

const initialState = "";

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SCREEN_WIDTH:
      return {
        ...state,
        screenWidth: action.payload
      };
    default:
      return state;
  }
}
