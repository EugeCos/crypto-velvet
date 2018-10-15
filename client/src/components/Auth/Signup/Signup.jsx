import React, { Component } from "react";
import axios from "axios";
import "../Auth.less";

// -----------COMPONENTS-----------
import TextFieldGroup from "../../Common/TextFieldGroup";

export default class Signup extends Component {
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

    axios
      .post("/api/users/register", newUser)
      .then(res => console.log(res.data))
      .catch(err => this.setState({ errors: err.response.data }));
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
