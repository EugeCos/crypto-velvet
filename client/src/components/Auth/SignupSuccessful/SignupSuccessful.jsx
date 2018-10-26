import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "./SignupSuccessful.less";

// --------COMPONENTS----------
import ButtonAction from "../../Common/ButtonAction";

// ----------REDUX-----------
import { connect } from "react-redux";

class SignupSuccessful extends Component {
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
          <ButtonAction
            name={"Login"}
            additionalStyle={"success-login-button"}
          />
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
