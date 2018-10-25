import React, { Component } from "react";
import PropTypes from "prop-types";
import Coin from "./Coin/Coin";
import "./CoinListContainer.less";

// -------REDUX--------
import { connect } from "react-redux";

class CoinListContainer extends Component {
  render() {
    const { myCoins, dialogStyle, titleStyle } = this.props;
    return (
      <div className="coinlist-container">
        <div className="coinlist-wrapper">
          <Coin dialogStyle={dialogStyle} titleStyle={titleStyle} />
        </div>
        {myCoins.length ? (
          <span
            style={{
              color: "#57606f",
              fontSize: "70%",
              float: "right",
              paddingRight: "10px"
            }}
          >
            exchange rates update every 10 seconds
          </span>
        ) : (
          ""
        )}
      </div>
    );
  }
}

CoinListContainer.propTypes = {
  myCoins: PropTypes.object.isRequired,
  currencyArray: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  myCoins: state.trade
});

export default connect(mapStateToProps)(CoinListContainer);
