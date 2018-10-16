import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "../Auth.less";

// -----------COMPONENTS-----------
import TextFieldGroup from "../../Common/TextFieldGroup";

// ---------REDUX----------
import { connect } from "react-redux";
import { registerUser } from "../../../actions/authActions";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = this.state;

    const newUser = {
      name,
      email,
      password,
      confirmPassword
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { name, email, password, confirmPassword, errors } = this.state;

    return (
      <div className="auth-container">
        <img src="/img/logo.png" alt="" className="logo" />
        <h4 className="auth-option-text">Sign Up</h4>
        <form
          noValidate
          style={{ marginTop: "30px" }}
          onSubmit={this.handleSubmit}
        >
          <TextFieldGroup
            type={"text"}
            name={"name"}
            placeholder={"Name"}
            value={name}
            handleChange={this.handleChange}
            error={errors.name}
          />
          <TextFieldGroup
            type={"email"}
            name={"email"}
            placeholder={"Email"}
            value={email}
            handleChange={this.handleChange}
            error={errors.email}
          />
          <TextFieldGroup
            type={"password"}
            name={"password"}
            placeholder={"Password"}
            value={password}
            handleChange={this.handleChange}
            error={errors.password}
          />
          <TextFieldGroup
            type={"password"}
            name={"confirmPassword"}
            placeholder={"Confirm password"}
            value={confirmPassword}
            handleChange={this.handleChange}
            error={errors.confirmPassword}
          />
          <button className="auth-button">Sign Up</button>
        </form>
      </div>
    );
  }
}

Signup.propTypes = {
  registerUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Signup));
