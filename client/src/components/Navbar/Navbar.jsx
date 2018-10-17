import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import "./Navbar.less";

// -------REDUX--------
import { connect } from "react-redux";
import { getScreenWidth } from "../../actions/screenWidthActions";
import { logoutUser } from "../../actions/authActions";

// ---------MATERIAL UI----------
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

class Navbar extends Component {
  componentWillMount() {
    this.props.getScreenWidth(window.innerWidth);
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { stopUpdatingEvery10Seconds } = this.props;
    const { isAuthenticated, user } = this.props.auth;

    const guestLinks = (
      <Fragment>
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
      </Fragment>
    );

    const authLinks = (
      <Fragment>
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            maxWidth: "30px",
            maxHeight: "30px",
            borderRadius: "40px"
          }}
          title="You need a Gravatar account for your picture to display"
        />
        <p className="auth-link name">{user.name}</p>
        <IconMenu
          menuStyle={{ font: "Varela Round" }}
          iconButtonElement={
            <IconButton iconStyle={{ color: "#fff" }}>
              <MoreVertIcon />
            </IconButton>
          }
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          targetOrigin={{ horizontal: "right", vertical: "top" }}
        >
          <MenuItem
            primaryText="Dashboard"
            onClick={() => this.props.history.push("/")}
          />
          <MenuItem
            primaryText="My Wallet"
            onClick={() => this.props.history.push("/wallet")}
          />
          <MenuItem
            primaryText="Profile"
            onClick={() => this.props.history.push("/profile")}
          />
          <MenuItem primaryText="Log out" onClick={this.onLogoutClick} />
        </IconMenu>
      </Fragment>
    );

    return (
      <div className="navbar">
        <Link to="/" className="navbar-logo">
          <h2>velvet crypto</h2>
        </Link>

        <div
          className={classnames("auth-links-container", {
            "guest-links": !isAuthenticated
          })}
        >
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  getScreenWidth: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getScreenWidth, logoutUser }
)(withRouter(Navbar));
