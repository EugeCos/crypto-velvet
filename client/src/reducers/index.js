import { combineReducers } from "redux";
import screenWidthReducer from "./screenWidthReducer";

export default combineReducers({
  screenWidth: screenWidthReducer
});
