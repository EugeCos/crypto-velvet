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
    return (
      <div className="custom-container">
        <CreateProfile user={user} />
      </div>
    );
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps)(Profile);
