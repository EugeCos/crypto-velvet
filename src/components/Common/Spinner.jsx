import React, { Component } from "react";
import spinner from "../../img/loading.gif";

// ---------REDUX----------
import { connect } from "react-redux";

const styleDesktop = {
  width: "46px",
  margin: "0 18px 0 0",
  display: "block"
};

const styleMobile = { width: "36px", margin: "0 4px 0", display: "block" };

class Spinner extends Component {
  render() {
    const { screenWidth } = this.props.screenWidth;
    return (
      <div>
        <img
          src={spinner}
          alt="Loading..."
          style={screenWidth > 480 ? styleDesktop : styleMobile}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({ screenWidth: state.screenWidth });

export default connect(mapStateToProps)(Spinner);
