import React, { Component } from "react";
import "./Wallet.less";

// ---------REDUX--------
import { connect } from "react-redux";

const red = { color: "#c0392b", paddingTop: "10px" },
  green = { color: "#27ae60", paddingTop: "10px" },
  white = { color: "#8395a7", paddingTop: "10px" };

class Wallet extends Component {
  render() {
    const { walletValue, walletValueDifference } = this.props;
    let fontStyle,
      sign = "";

    // Applying red or green color to Wallet Value Difference
    if (walletValueDifference) {
      if (walletValueDifference < 0) {
        fontStyle = red;
      } else if (
        walletValueDifference === 0 ||
        walletValueDifference === "0.00"
      ) {
        fontStyle = white;
      } else {
        fontStyle = green;
        sign = "+";
      }
    }

    return (
      <div className="wallet">
        {" "}
        <h1>
          {walletValue.toLocaleString("en", {
            maximumFractionDigits: 2
          })}&nbsp;Usd
        </h1>
        <h3 style={fontStyle}>{`${sign} ${walletValueDifference}`}</h3>
        <span style={{ color: "#57606f", fontSize: "70%" }}>
          ( change based on your trading activity )
        </span>
      </div>
    );
  }
}

const mapStateToProps = state => ({ coins: state.coins });

export default connect(mapStateToProps)(Wallet);
