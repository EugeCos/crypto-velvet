import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./CreateProfile.less";

// ---------REDUX---------
import { connect } from "react-redux";

// -----------COMPONENTS-----------
import ButtonAction from "../../Common/ButtonAction";

class CreateProfile extends Component {
  constructor() {
    super();
    this.state = {
      createProfileClicked: false
    };
  }
  render() {
    const { user } = this.props;
    let createProfileDisplay = !this.state.createProfileClicked ? (
      <Fragment>
        <img className="profile-avatar" src={user.avatar} alt="" />
        <h3>Hello {user.name.split(" ")[0]}!</h3>
        <p>Looks like you don't have a profile yet.</p>
        <p>Please create one.</p>
        <ButtonAction
          callback={this.setState({ createProfileClicked: true })}
          name={"Create profile"}
        />
      </Fragment>
    ) : (
      ""
    );
    return (
      <div className="create-profile-container">{createProfileDisplay}</div>
    );
  }
}

CreateProfile.propTypes = {
  user: PropTypes.object.isRequired
};

export default connect(null)(CreateProfile);
