import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "./SignupSuccessful.less";

// ----------REDUX-----------
import { connect } from "react-redux";

class SignupSuccessful extends Component {
  constructor() {
    super();
    this.state = {
      landedFromSignup: false
    };
  }

  componenWillMount() {
    console.log("here");
  }

  render() {
    let name = [];
    if (this.props.auth.tempUserName) {
      name = this.props.auth.tempUserName.split(" ");
    }

    let pageDisplay = this.props.auth.tempUserName ? (
      <div className="signup-successful-container">
        <img src="/img/dance_color.svg" alt="success" className="dance-icon" />
        <h3>Thanks for registering {name[0]}!</h3>
        <p>Log in to your account to start your trading journey.</p>
        <Link to="/login">
          <button className="auth-button success-login-button">Login</button>
        </Link>
      </div>
    ) : (
      <Redirect to="/login" />
    );

    return <Fragment>{pageDisplay}</Fragment>;
  }
}

SignupSuccessful.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(SignupSuccessful);
