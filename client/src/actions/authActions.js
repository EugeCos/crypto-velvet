import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  SET_TEMPORARY_USERNAME_UPON_SUCCESSFUL_REGISTRATION,
  UPDATE_PORTFOLIO
} from "./types";
import setAuthToken from "../utils/setAuthToken";
import { store } from "../store";
import { clearTradeObject, getCurrentPortfolio } from "./tradeActions";

// Register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      dispatch({
        type: SET_TEMPORARY_USERNAME_UPON_SUCCESSFUL_REGISTRATION,
        payload: userData.name
      });
      history.push("/registration-successful");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login user - Get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      const { token } = res.data;

      // Set token to local storage
      localStorage.setItem("jwtToken", token);

      // Set token to auth-header
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);

      // Set current user
      dispatch(setCurrentUser(decoded));

      // Get user's portfolio
      dispatch(getCurrentPortfolio());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = history => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");

  // Remove auth header for future requests
  setAuthToken(false);

  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));

  // Send user to Login page
  if (history) {
    history.push("/login");
  }

  // Clear Trade object
  store.dispatch(clearTradeObject());
};

export const updatePortfolio = (authStatus, portfolioData) => dispatch => {
  if (authStatus) {
    axios.post("/api/users/update-portfolio", portfolioData).then(res =>
      dispatch({
        type: UPDATE_PORTFOLIO,
        payload: res.data.portfolio
      })
    );
  }
};
