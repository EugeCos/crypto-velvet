import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "../Auth.less";

// ----------REACT-CSS-TRANSITION-GROUP-----------
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

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

    const { stopUpdatingEvery10Seconds } = this.props;
    stopUpdatingEvery10Seconds();
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
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: ""
      }
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
    const { screenWidth } = this.props;
    const customWidth =
      screenWidth.screenWidth / (screenWidth.screenWidth > 1024 ? 5.5 : 2.2);

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
            <ButtonAction name={"Login"} />
          </form>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  screenWidth: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  screenWidth: state.screenWidth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Login));
