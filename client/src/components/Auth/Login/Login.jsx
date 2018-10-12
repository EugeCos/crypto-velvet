import React, { Component } from "react";
import "../Auth.less";

// -----------COMPONENTS-----------
import TextFieldGroup from "../../Common/TextFieldGroup";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      login: "",
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
    const { login, password } = this.state;
    return (
      <div className="auth-container">
        <img src="/img/logo.png" alt="" className="logo" />
        <h4 className="auth-option-text">Login</h4>
        <form style={{ marginTop: "30px" }} onSubmit={this.handleSubmit}>
          <TextFieldGroup
            type={"email"}
            name={"login"}
            placeholder={"Email"}
            value={login}
            handleChange={this.handleChange}
          />
          <TextFieldGroup
            type={"password"}
            name={"password"}
            placeholder={"Password"}
            value={password}
            handleChange={this.handleChange}
          />
          <button className="auth-button">Login</button>
        </form>
      </div>
    );
  }
}
