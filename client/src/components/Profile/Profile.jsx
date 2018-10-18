import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Profile.less";

// ---------REDUX---------
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";

// ---------COMPONENTS----------
import CreateProfile from "./CreateProfile/CreateProfile";
import Spinner from "../Common/Spinner";

class Profile extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    const { screenWidth } = this.props.screenWidth;

    let profileDisplay;

    if (profile === null || loading) {
      profileDisplay = <Spinner />;
    } else {
      profileDisplay = <CreateProfile user={user} screenWidth={screenWidth} />;
    }

    return (
      <div className="custom-container" style={{ width: "60%" }}>
        {profileDisplay}
      </div>
    );
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  screenWidth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  screenWidth: state.screenWidth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Profile);
