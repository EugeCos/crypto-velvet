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
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        profileDisplay = (
          <div className="profile-container">
            <div className="left-side-wrapper">
              <img src={user.avatar} className="profile-picture" alt="avatar" />
              <h4>{user.name}</h4>
              <div className="location-wrapper">
                <i class="fa fa-map-marker" />
                <p>{profile.location}</p>
              </div>
              <div className="website-wrapper">
                <i className="fa fa-globe" />
                <p onClick={() => window.open(profile.website, "_blank")}>
                  {profile.website}
                </p>
              </div>
            </div>
            <div className="right-side-wrapper">
              <p>Most embarrassing song on Spotify:</p>
              <p>After work you can find me at:</p>
              <p>What I would do with a million dollars:</p>
              <p>I won’t shut up about:</p>
              <p>My most irrational fear is:</p>
              <p>One thing I’ll never do again is:</p>
            </div>
          </div>
        );
      } else {
        profileDisplay = (
          <CreateProfile user={user} screenWidth={screenWidth} />
        );
      }
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
