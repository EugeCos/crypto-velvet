import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "../Auth.less";

// ----------REACT-CSS-TRANSITION-GROUP-----------
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

// -----------COMPONENTS-----------
import TextFieldGroup from "../../Common/TextFieldGroup";
import ButtonAction from "../../Common/ButtonAction";

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

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }

    const { stopUpdatingEvery10Seconds } = this.props;
    stopUpdatingEvery10Seconds();
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
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: ""
      }
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
    const { screenWidth } = this.props;
    const customWidth =
      screenWidth.screenWidth / (screenWidth.screenWidth > 1024 ? 5.5 : 2.5);

    const transitionOptions = {
      transitionName: "fade-effect",
      transitionAppearTimeout: 300,
      transitionAppear: true,
      transitionEnter: false,
      transitionLeave: false
    };

    return (
      <ReactCSSTransitionGroup {...transitionOptions}>
        <div className="custom-container">
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
              customWidth={customWidth}
            />
            <TextFieldGroup
              type={"email"}
              name={"email"}
              placeholder={"Email"}
              value={email}
              handleChange={this.handleChange}
              error={errors.email}
              customWidth={customWidth}
            />
            <TextFieldGroup
              type={"password"}
              name={"password"}
              placeholder={"Password"}
              value={password}
              handleChange={this.handleChange}
              error={errors.password}
              customWidth={customWidth}
            />
            <TextFieldGroup
              type={"password"}
              name={"confirmPassword"}
              placeholder={"Confirm password"}
              value={confirmPassword}
              handleChange={this.handleChange}
              error={errors.confirmPassword}
              customWidth={customWidth}
            />
            <ButtonAction name={"Sign Up"} />
          </form>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

Signup.propTypes = {
  registerUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  screenWidth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  screenWidth: state.screenWidth,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Signup));
