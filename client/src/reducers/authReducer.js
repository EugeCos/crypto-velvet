import {
  SET_CURRENT_USER,
  SET_TEMPORARY_USERNAME_UPON_SUCCESSFUL_REGISTRATION,
  UPDATE_USERNAME,
  UPDATE_PORTFOLIO
} from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = { isAuthenticated: false, user: {}, loading: false };

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
    case UPDATE_PORTFOLIO:
      return {
        ...state,
        user: {
          ...state.user,
          portfolio: action.payload
        },
        loading: false
      };

    default:
      return state;
  }
}
