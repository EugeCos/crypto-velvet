import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";

/*-------------FONT-AWESOME-------------*/
import "../node_modules/font-awesome/css/font-awesome.min.css";

// -------PRIVATE ROUTES WRAPPER-------
import PrivateRoute from "./components/Common/PrivateRoute";

// ----------COMPONENTS------------
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Signup from "./components/Auth/Signup/Signup";
import SignupSuccessful from "./components/Auth/SignupSuccessful/SignupSuccessful";
import Login from "./components/Auth/Login/Login";
import Profile from "./components/Profile/Profile";
import EditProfile from "./components/Profile/EditProfile/EditProfile";

// -------------CSS--------------
import "./App.css";
import "./css/global.less";

// --------------REDUX--------------
import { store } from "./store";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";
import { getAllCoinsWithAvatars } from "./actions/tradeActions";

// ----------UTILITY FUNCITONS-----------
import setAuthToken from "./utils/setAuthToken";

// Check for token in Local Storage
if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;

  // Decode token and get user info and expiration
  const decoded = jwt_decode(token);

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Clear current user's profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = "/login";
  }

  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      intervalIndex: 0 // Interval index is need needed to kill updateRatesEvery10Sec()
    };
  }

  componentDidMount() {
    store.dispatch(getAllCoinsWithAvatars());
  }

  getTimeoutIntervalIndex = intervalIndex => {
    this.setState({
      intervalIndex
    });
  };

  stopUpdatingEvery10Seconds = () => {
    console.log("Update rates stopped");
    const { intervalIndex } = this.state;
    clearInterval(intervalIndex);

    this.setState({
      intervalIndex: 0
    });
  };

  render() {
    return (
      <div className="App">
        <Navbar />
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Dashboard
                getTimeoutIntervalIndex={this.getTimeoutIntervalIndex}
              />
            )}
          />
          <Route
            exact
            path="/login"
            render={() => (
              <Login
                stopUpdatingEvery10Seconds={this.stopUpdatingEvery10Seconds}
              />
            )}
          />
          <Route
            exact
            path="/signup"
            render={() => (
              <Signup
                stopUpdatingEvery10Seconds={this.stopUpdatingEvery10Seconds}
              />
            )}
          />
          <Route
            exact
            path="/registration-successful"
            component={SignupSuccessful}
          />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        </Switch>
      </div>
    );
  }
}

export default App;
