import React, { Component, Fragment } from "react";

// --------COMPONENTS---------
import AddCoin from "./AddCoin/AddCoin";
import CoinListContainer from "./CoinListContainer/CoinListContainer";
import Wallet from "./Wallet/Wallet";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { intervalIndex: 0 };
  }
  componentWillMount() {
    const { updateRatesEvery10Sec } = this.props;
    let intervalIndex = setInterval(() => updateRatesEvery10Sec(), 8000);

    this.setState({
      intervalIndex
    });
  }

  componentDidMount() {
    const { getTimeoutIntervalIndex } = this.props;
    getTimeoutIntervalIndex(this.state.intervalIndex);
  }

  render() {
    const {
      walletValue,
      walletValueDifference,
      myCoins,
      deleteCoin,
      tradeCoins,
      currencyArray,
      allCoins,
      addCoin
    } = this.props;
    return (
      <Fragment>
        <Wallet
          walletValue={walletValue}
          walletValueDifference={walletValueDifference}
        />
        <CoinListContainer
          myCoins={myCoins}
          deleteCoin={deleteCoin}
          tradeCoins={tradeCoins}
          currencyArray={currencyArray}
        />
        <AddCoin allCoins={allCoins} addCoin={addCoin} />
      </Fragment>
    );
  }
}
