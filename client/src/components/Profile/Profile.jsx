import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Profile.less";

// ---------REDUX---------
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";

// ---------COMPONENTS----------
import CreateProfile from "./CreateProfile/CreateProfile";
import Spinner from "../Common/Spinner";

// -------MATERIAL-UI-------
import ButtonAction from "../Common/ButtonAction";

class Profile extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  handleDelete = e => {
    this.props.deleteAccount();
  };

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
          <Fragment>
            <h4 className="profile-header">Profile</h4>
            <div className="profile-container">
              {/* ----------NAME, AVATAR AND BUTTONS----------- */}
              <div className="left-side-wrapper">
                <img
                  src={user.avatar}
                  className="profile-picture"
                  alt="avatar"
                />
                <h4>{user.name}</h4>
                {profile.location ? (
                  <div className="location-wrapper">
                    <i className="fa fa-map-marker" />
                    <p>{profile.location}</p>
                  </div>
                ) : (
                  ""
                )}

                {profile.website ? (
                  <div className="website-wrapper">
                    <i className="fa fa-globe" />
                    <p
                      onClick={() =>
                        window.open(`https://${profile.website}`, "_blank")
                      }
                    >
                      {profile.website}
                    </p>
                  </div>
                ) : (
                  ""
                )}

                {screenWidth > 1024 ? (
                  <Fragment>
                    {" "}
                    <Link to="/edit-profile">
                      <ButtonAction
                        name="edit profile"
                        additionalStyle={"btn-edit-profile"}
                      />
                    </Link>
                    <Link to="/">
                      <ButtonAction
                        name="dashboard"
                        additionalStyle={"btn-dashboard"}
                      />
                    </Link>
                    <p
                      onClick={this.handleDelete}
                      className="delete-account-link"
                    >
                      Delete Account
                    </p>
                  </Fragment>
                ) : null}
              </div>

              {/* -----------ANSWERS TO PROFILE QUESTIONS----------- */}
              <div className="right-side-wrapper">
                <hr className="hr-small-screen" />
                <div className="questions-container">
                  {profile.mostEmbarassingSong ? (
                    <div className="question-block">
                      <div className="question-information">
                        <p className="profile-question">
                          Most embarrassing song on Spotify:
                        </p>
                        <p className="profile-answer">
                          {profile.mostEmbarassingSong}
                        </p>
                      </div>
                      <i className="fa fa-music" />
                      <hr className="hr-styled" />
                    </div>
                  ) : (
                    ""
                  )}

                  {profile.afterWorkYouCanFindMeAt ? (
                    <div className="question-block">
                      <div className="question-information">
                        <p className="profile-question">
                          After work you can find me at:
                        </p>
                        <p className="profile-answer">
                          {profile.afterWorkYouCanFindMeAt}
                        </p>
                      </div>
                      <i className="fa fa-glass" />
                      <hr className="hr-styled" />
                    </div>
                  ) : (
                    ""
                  )}

                  {profile.whatWouldIDoWithMillion ? (
                    <div className="question-block">
                      <div className="question-information">
                        <p className="profile-question">
                          What I would do with a million dollars:
                        </p>
                        <p className="profile-answer">
                          {profile.whatWouldIDoWithMillion}
                        </p>
                      </div>
                      <i className="fa fa-money" />
                      <hr className="hr-styled" />
                    </div>
                  ) : (
                    ""
                  )}

                  {profile.iWontShutUpAbout ? (
                    <div className="question-block">
                      <div className="question-information">
                        <p className="profile-question">
                          I won’t shut up about:
                        </p>
                        <p className="profile-answer">
                          {profile.iWontShutUpAbout}
                        </p>
                      </div>
                      <i className="fa fa-bullhorn" />
                      <hr className="hr-styled" />
                    </div>
                  ) : (
                    ""
                  )}

                  {profile.myMostIrrationalFear ? (
                    <div className="question-block">
                      <div className="question-information">
                        <p className="profile-question">
                          My most irrational fear is:
                        </p>
                        <p className="profile-answer">
                          {profile.myMostIrrationalFear}
                        </p>
                      </div>
                      <i className="fa fa-eye" />
                      <hr className="hr-styled" />
                    </div>
                  ) : (
                    ""
                  )}

                  {profile.thingIWillNeverDoAgain ? (
                    <div className="question-block">
                      <div className="question-information">
                        <p className="profile-question">
                          One thing I’ll never do again is:
                        </p>
                        <p className="profile-answer">
                          {profile.thingIWillNeverDoAgain}
                        </p>
                      </div>
                      <i className="fa fa-fire" />
                      <hr className="hr-styled" />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {screenWidth < 1024 ? (
                  <Fragment>
                    {" "}
                    <Link to="/edit-profile">
                      <ButtonAction
                        name="edit profile"
                        additionalStyle={"btn-edit-profile"}
                      />
                    </Link>
                    <Link to="/">
                      <ButtonAction
                        name="dashboard"
                        additionalStyle={"btn-dashboard"}
                      />
                    </Link>
                    <ButtonAction
                      name="wallet"
                      additionalStyle={"btn-wallet"}
                    />
                    <p
                      onClick={this.handleDelete}
                      className="delete-account-link"
                    >
                      Delete Account
                    </p>
                  </Fragment>
                ) : null}
              </div>
            </div>
          </Fragment>
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
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  screenWidth: state.screenWidth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Profile);
