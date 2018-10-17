import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Profile.less";

// ---------REDUX---------
import { connect } from "react-redux";

// ---------COMPONENTS----------
import CreateProfile from "./CreateProfile/CreateProfile";

class Profile extends Component {
  render() {
    const { user } = this.props.auth;
    const { screenWidth } = this.props.screenWidth;
    return (
      <div className="custom-container" style={{ width: "60%" }}>
        <CreateProfile user={user} screenWidth={screenWidth} />
      </div>
    );
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  screenWidth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  screenWidth: state.screenWidth
});

export default connect(mapStateToProps)(Profile);
