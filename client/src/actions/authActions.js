import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  SET_TEMPORARY_USERNAME_UPON_SUCCESSFUL_REGISTRATION,
  UPDATE_USERNAME,
  GET_PROFILE
} from "./types";
import setAuthToken from "../utils/setAuthToken";

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
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");

  // Remove auth header for future requests
  setAuthToken(false);

  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

export const updateUserName = name => dispatch => {
  axios
    .post("/api/users/edit", name)
    .then(res =>
      dispatch({
        type: UPDATE_USERNAME,
        payload: res.data.name
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
