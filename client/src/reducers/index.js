import { combineReducers } from "redux";
import screenWidthReducer from "./screenWidthReducer";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";

export default combineReducers({
  screenWidth: screenWidthReducer,
  errors: errorReducer,
  auth: authReducer,
  profile: profileReducer
});
