import React, { Component } from "react";
import "../Auth.less";

// -----------COMPONENTS-----------
import TextFieldGroup from "../../Common/TextFieldGroup";

export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    const { name, email, password } = this.state;
    return (
      <div className="auth-container">
        <img src="/img/logo.png" alt="" className="logo" />
        <h4 className="auth-option-text">Sign Up</h4>
        <form style={{ marginTop: "30px" }} onSubmit={this.handleSubmit}>
          <TextFieldGroup
            type={"text"}
            name={"name"}
            placeholder={"Name"}
            value={name}
            handleChange={this.handleChange}
          />
          <TextFieldGroup
            type={"text"}
            name={"email"}
            placeholder={"Email"}
            value={email}
            handleChange={this.handleChange}
          />
          <TextFieldGroup
            type={"password"}
            name={"password"}
            placeholder={"Password"}
            value={password}
            handleChange={this.handleChange}
          />
          <button className="auth-button">Sign Up</button>
        </form>
      </div>
    );
  }
}
