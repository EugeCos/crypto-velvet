import { combineReducers } from "redux";
import screenWidthReducer from "./screenWidthReducer";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import tradeReducer from "./tradeReducer";

export default combineReducers({
  screenWidth: screenWidthReducer,
  errors: errorReducer,
  auth: authReducer,
  profile: profileReducer,
  trade: tradeReducer
});
