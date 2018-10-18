import React, { Component } from "react";
import PropTypes from "prop-types";
import "../Auth.less";

// --------REDUX---------
import { connect } from "react-redux";
import { loginUser } from "../../../actions/authActions";

// -----------COMPONENTS-----------
import TextFieldGroup from "../../Common/TextFieldGroup";
import ButtonAction from "../../Common/ButtonAction";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/profile");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/profile");
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;

    const userLogin = {
      email,
      password
    };

    this.props.loginUser(userLogin);
  };

  render() {
    const { email, password, errors } = this.state;
    return (
      <div className="custom-container">
        <img src="/img/logo.png" alt="" className="logo" />
        <h4 className="auth-option-text">Login</h4>
        <form
          noValidate
          style={{ marginTop: "30px" }}
          onSubmit={this.handleSubmit}
        >
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
          <ButtonAction name={"Login"} />
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
