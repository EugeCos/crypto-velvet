import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Navbar.less";

// -------REDUX--------
import { connect } from "react-redux";
import { getScreenWidth } from "../../actions/screenWidthActions";

class Navbar extends Component {
  componentWillMount() {
    this.props.getScreenWidth(window.innerWidth);
  }

  render() {
    const { stopUpdatingEvery10Seconds } = this.props;

    return (
      <div className="navbar">
        <Link to="/" className="navbar-logo">
          <h2>velvet crypto</h2>
        </Link>

        <div className="auth-links-container">
          <Link
            to="/login"
            className="auth-link login"
            onClick={stopUpdatingEvery10Seconds}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="auth-link signup"
            onClick={stopUpdatingEvery10Seconds}
          >
            Signup
          </Link>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { getScreenWidth }
)(Navbar);
