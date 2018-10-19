import {
  SET_CURRENT_USER,
  SET_TEMPORARY_USERNAME_UPON_SUCCESSFUL_REGISTRATION,
  UPDATE_USERNAME
} from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = { isAuthenticated: false, user: {} };

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case SET_TEMPORARY_USERNAME_UPON_SUCCESSFUL_REGISTRATION:
      return {
        ...state,
        tempUserName: action.payload
      };
    case UPDATE_USERNAME:
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload
        }
      };
    default:
      return state;
  }
}
