import React, { Component } from "react";
import "./CoinModal.less";

const red = { color: "#c0392b" },
  green = { color: "#27ae60" };

export default class CoinModal extends Component {
  constructor() {
    super();
    this.state = {
      totalValue: "0.00",
      numberOfCoins: "",
      error: false
    };
  }

  handleChange = e => {
    const { rateToUSD } = this.props.coin;
    let totalValue = Number(e.target.value * rateToUSD);
    let holding = Number(e.target.value);
    this.setState({
      numberOfCoins: holding,
      error: false,
      totalValue
    });
  };

  handleClick = tradeOption => {
    const { numberOfCoins, totalValue } = this.state;
    const { tradeCoins, handleClose, coin } = this.props;
    const { name } = coin;

    let totalValueWithMathSign = totalValue,
      numberOfCoinsWithMathSign = numberOfCoins;
    if (tradeOption === "sell") {
      totalValueWithMathSign = -totalValueWithMathSign;
      numberOfCoinsWithMathSign = -numberOfCoinsWithMathSign;
    }

    if (!numberOfCoins) {
      this.setState({
        error: true
      });
    } else {
      tradeCoins(numberOfCoinsWithMathSign, totalValueWithMathSign, name);
      handleClose();
    }
  };

  render() {
    const { totalValue, numberOfCoins, error } = this.state;
    const { coin, handleClose } = this.props;
    const percent = coin.percentChange24Hr;
    let percentColor = {};
    let percentArrow;

    if (percent.includes("-")) {
      percentColor = red;
      percentArrow = "fa-caret-down";
    } else if (percent.includes("0.00") || percent.includes("N/a")) {
      percentColor = null;
    } else {
      percentColor = green;
      percentArrow = "fa-caret-up";
    }

    return (
      <div className="coin-modal-container">
        <section className="header-and-wallet-container d-flex">
          <div className="modal-header">
            <div className="d-flex coin-details">
              <img
                className="coin-modal-avatar"
                src={coin.avatar}
                alt="avatar"
              />
              <div className="flex-column">
                <h2>{coin.coinName}</h2>
                <h4>
                  {coin.name}&nbsp;&nbsp;&#8226;&nbsp;&nbsp;$&nbsp;{
                    coin.rateToUSD
                  }
                </h4>
              </div>
            </div>

            <div className="d-flex low-high-wrapper">
              <p>
                Low 24h:&nbsp;<span style={red}>$&nbsp;{coin.low24Hr}</span>
              </p>
              <p>
                High 24h:&nbsp;<span style={green}>$&nbsp;{coin.high24Hr}</span>
              </p>
              <div className="d-flex percent-change">
                <p style={{ color: "rgb(168, 168, 168)" }}>
                  24h change:&nbsp;&nbsp;
                </p>
                <i className={`fa ${percentArrow}`} style={percentColor} />
                <span style={percentColor}>&nbsp;{coin.percentChange24Hr}</span>
              </div>
            </div>
          </div>

          <div className="modal-wallet">
            <p>Wallet</p>
            <h1>{`${coin.totalValue.toLocaleString("en", {
              maximumFractionDigits: 2
            })} Usd`}</h1>
            <div className="modal-holder-coin">
              <img className="purple-coin" src="/img/purple_coin.png" alt="" />
              <h3>{coin.holding.toFixed(2)}</h3>
            </div>
          </div>
        </section>

        {coin.high24Hr === "N/a" ? (
          <div className="corrupt-coin">
            <i className="fa fa-exclamation-triangle" />
            <br />
            <h4>
              There is no data available for this coin. Please select another
              coin.
            </h4>
            <div
              className="custom-button btn-return"
              onClick={() => handleClose()}
            >
              <h4>Return</h4>
            </div>
          </div>
        ) : (
          <section className="holding-container d-flex flex-column">
            <h4>Holding</h4>
            <form>
              <input
                type="number"
                placeholder="0.00"
                value={numberOfCoins}
                onChange={this.handleChange}
              />
            </form>
            <h4 className="total-value">
              Total value:{" "}
              {`${totalValue.toLocaleString("en", {
                maximumFractionDigits: 2
              })} Usd`}
            </h4>

            <div className="buttons-container d-flex flex-row">
              <div
                className="custom-button btn-buy"
                onClick={() => this.handleClick("buy")}
              >
                <h4>Buy</h4>
              </div>
              <div
                className="custom-button btn-sell"
                onClick={() => this.handleClick("sell")}
              >
                <h4>Sell</h4>
              </div>
            </div>
            {error ? <p className="error-message">Please enter a value</p> : ""}
          </section>
        )}
      </div>
    );
  }
}
