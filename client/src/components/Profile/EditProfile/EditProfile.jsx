import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../../Common/TextFieldGroup";
import isEmpty from "../../../validation/is-empty";
import "../Profile.less";
import "../CreateProfile/CreateProfile.less";

// ---------REDUX---------
import { connect } from "react-redux";
import {
  getCurrentProfile,
  createProfile
} from "../../../actions/profileActions";

// -----------COMPONENTS-----------
import ButtonAction from "../../Common/ButtonAction";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      website: "",
      location: "",
      mostEmbarassingSong: "",
      afterWorkYouCanFindMeAt: "",
      whatWouldIDoWithMillion: "",
      iWontShutUpAbout: "",
      myMostIrrationalFear: "",
      thingIWillNeverDoAgain: "",
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      // If profile field doesn't exist, make empty string
      profile.website = !isEmpty(profile.website) ? profile.website : "";
      profile.location = !isEmpty(profile.location) ? profile.location : "";
      profile.mostEmbarassingSong = !isEmpty(profile.mostEmbarassingSong)
        ? profile.mostEmbarassingSong
        : "";
      profile.afterWorkYouCanFindMeAt = !isEmpty(
        profile.afterWorkYouCanFindMeAt
      )
        ? profile.afterWorkYouCanFindMeAt
        : "";
      profile.whatWouldIDoWithMillion = !isEmpty(
        profile.whatWouldIDoWithMillion
      )
        ? profile.whatWouldIDoWithMillion
        : "";
      profile.iWontShutUpAbout = !isEmpty(profile.iWontShutUpAbout)
        ? profile.iWontShutUpAbout
        : "";
      profile.myMostIrrationalFear = !isEmpty(profile.myMostIrrationalFear)
        ? profile.myMostIrrationalFear
        : "";
      profile.thingIWillNeverDoAgain = !isEmpty(profile.thingIWillNeverDoAgain)
        ? profile.thingIWillNeverDoAgain
        : "";

      // Set component fields state
      this.setState({
        website: profile.website,
        location: profile.location,
        mostEmbarassingSong: profile.mostEmbarassingSong,
        afterWorkYouCanFindMeAt: profile.afterWorkYouCanFindMeAt,
        whatWouldIDoWithMillion: profile.whatWouldIDoWithMillion,
        iWontShutUpAbout: profile.iWontShutUpAbout,
        myMostIrrationalFear: profile.myMostIrrationalFear,
        thingIWillNeverDoAgain: profile.thingIWillNeverDoAgain,
        name: profile.user.name
      });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      name,
      website,
      location,
      mostEmbarassingSong,
      afterWorkYouCanFindMeAt,
      whatWouldIDoWithMillion,
      iWontShutUpAbout,
      myMostIrrationalFear,
      thingIWillNeverDoAgain
    } = this.state;

    const newProfile = {
      website,
      location,
      mostEmbarassingSong,
      afterWorkYouCanFindMeAt,
      whatWouldIDoWithMillion,
      iWontShutUpAbout,
      myMostIrrationalFear,
      thingIWillNeverDoAgain
    };

    this.props.createProfile(newProfile);
    this.props.history.push("/profile");
  };

  render() {
    const { screenWidth } = this.props.screenWidth;
    const { errors } = this.state;
    const {
      name,
      website,
      location,
      mostEmbarassingSong,
      afterWorkYouCanFindMeAt,
      whatWouldIDoWithMillion,
      iWontShutUpAbout,
      myMostIrrationalFear,
      thingIWillNeverDoAgain
    } = this.state;
    let customWidth = screenWidth / 2.2;

    return (
      <div className="custom-container" style={{ width: "60%" }}>
        <div className="create-profile-container">
          <Fragment>
            <h3>Edit profile</h3>
            <TextFieldGroup
              name={"website"}
              placeholder={"www.mysite.com"}
              value={website}
              handleChange={this.handleChange}
              type={"text"}
              info={"Link to your website"}
              customWidth={customWidth}
              error={errors.website}
            />
            <TextFieldGroup
              name={"location"}
              placeholder={"Toronto, Ontario"}
              value={location}
              handleChange={this.handleChange}
              type={"text"}
              info={"Location"}
              customWidth={customWidth}
            />
            <TextFieldGroup
              name={"mostEmbarassingSong"}
              placeholder={"eg. Backstreet Boys - As long as you love me"}
              value={mostEmbarassingSong}
              handleChange={this.handleChange}
              type={"text"}
              info={"Most embarassing song on your Spotify"}
              customWidth={customWidth}
              error={errors.mostEmbarassingSong}
            />
            <TextFieldGroup
              name={"afterWorkYouCanFindMeAt"}
              placeholder={"eg. Gym, Library, Bar"}
              value={afterWorkYouCanFindMeAt}
              handleChange={this.handleChange}
              type={"text"}
              info={"After work you can find me at"}
              customWidth={customWidth}
            />
            <TextFieldGroup
              name={"whatWouldIDoWithMillion"}
              placeholder={"eg. Buy a Ferrari"}
              value={whatWouldIDoWithMillion}
              handleChange={this.handleChange}
              type={"text"}
              info={"What I would do with a million dollars"}
              customWidth={customWidth}
            />
            <TextFieldGroup
              name={"iWontShutUpAbout"}
              placeholder={"eg. How there is sugar everywhere"}
              value={iWontShutUpAbout}
              handleChange={this.handleChange}
              type={"text"}
              info={"I won’t shut up about"}
              customWidth={customWidth}
            />
            <TextFieldGroup
              name={"myMostIrrationalFear"}
              placeholder={"eg. Snakes, Clowns, Mother-in-law"}
              value={myMostIrrationalFear}
              handleChange={this.handleChange}
              type={"text"}
              info={"My most irrational fear is"}
              customWidth={customWidth}
            />
            <TextFieldGroup
              name={"thingIWillNeverDoAgain"}
              placeholder={"eg. Poke a bear with a stick"}
              value={thingIWillNeverDoAgain}
              handleChange={this.handleChange}
              type={"text"}
              info={"One thing I’ll never do again is"}
              customWidth={customWidth}
            />
            <ButtonAction
              callback={this.handleSubmit}
              name={"Submit"}
              additionalStyle={"submit-button"}
            />
          </Fragment>
        </div>
      </div>
    );
  }
}

EditProfile.propTypes = {
  errors: PropTypes.object.isRequired,
  screenWidth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  createProfile: PropTypes.func.isRequired,
  updateUserName: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  profile: state.profile,
  screenWidth: state.screenWidth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, createProfile }
)(withRouter(EditProfile));
