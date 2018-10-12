import React, { Component } from "react";
import Coin from "./Coin/Coin";
import "./CoinListContainer.less";

export default class CoinListContainer extends Component {
  render() {
    const {
      myCoins,
      deleteCoin,
      tradeCoins,
      currencyArray,
      dialogStyle,
      titleStyle
    } = this.props;
    return (
      <div className="coinlist-container">
        <div className="coinlist-wrapper">
          <Coin
            myCoins={myCoins}
            deleteCoin={deleteCoin}
            tradeCoins={tradeCoins}
            currencyArray={currencyArray}
            dialogStyle={dialogStyle}
            titleStyle={titleStyle}
          />
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
