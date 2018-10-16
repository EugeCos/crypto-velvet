import { combineReducers } from "redux";
import screenWidthReducer from "./screenWidthReducer";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  screenWidth: screenWidthReducer,
  errors: errorReducer,
  auth: authReducer
});
