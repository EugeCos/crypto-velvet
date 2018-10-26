import React, { Component } from "react";
import PropTypes from "prop-types";
import Coin from "./Coin/Coin";
import "./CoinListContainer.less";

// -------REDUX--------
import { connect } from "react-redux";

// --------COMPONENTS---------
import Spinner from "../../Common/Spinner";

class CoinListContainer extends Component {
  render() {
    const { dialogStyle, titleStyle } = this.props;
    const { myCoins, loading } = this.props.trade;
    return (
      <div className="coinlist-container">
        <div className="coinlist-wrapper">
          {loading ? (
            <div className="coin-spinner-wrapper">
              <Spinner />
            </div>
          ) : (
            <Coin dialogStyle={dialogStyle} titleStyle={titleStyle} />
          )}
        </div>
        {myCoins.length && !loading ? (
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
  trade: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  trade: state.trade
});

export default connect(mapStateToProps)(CoinListContainer);
