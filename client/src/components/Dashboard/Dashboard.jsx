import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// --------------REDUX--------------
import { connect } from "react-redux";
import { updatePortfolio } from "../../actions/authActions";
import {
  getAllCoinsWithAvatars,
  fetchRates,
  updateRatesEvery10Sec
} from "../../actions/tradeActions";

// --------COMPONENTS---------
import AddCoin from "./AddCoin/AddCoin";
import CoinListContainer from "./CoinListContainer/CoinListContainer";
import Wallet from "./Wallet/Wallet";
import Footer from "../Footer/Footer";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      intervalIndex: 0 // Interval index is needed to kill updateRatesEvery10Sec()
    };
  }

  componentWillMount() {
    let intervalIndex = setInterval(
      () => this.props.updateRatesEvery10Sec(),
      8000
    );

    this.setState({
      intervalIndex
    });
  }

  componentDidMount() {
    const { getTimeoutIntervalIndex, fetchRates } = this.props;
    getTimeoutIntervalIndex(this.state.intervalIndex);
    const { currencyArray } = this.props.trade;

    // if (this.props.auth.isAuthenticated) {
    //   const portfolio = this.props.auth.user.portfolio;
    //   this.setState(
    //     {
    //       currencyArray: portfolio.currencyArray,
    //       myCoins: portfolio.myCoins,
    //       walletDifference: portfolio.walletDifference,
    //       walletValue: portfolio.walletValue
    //     },
    //     () => this.fetchRates()
    //   );
    // } else {
    //   this.setState(
    //     {
    //       currencyArray: initialCoinList,
    //       walletValueDifference: "0.00",
    //       walletValue: 0
    //     },
    //     () => this.fetchRates()
    //   );
    // }
    fetchRates(currencyArray);
  }

  componentWillReceiveProps(nextProps) {
    const portfolio = nextProps.auth.user.portfolio;
    const { myCoins, allCoins, currencyArray } = this.props.trade;
    const { isAuthenticated } = this.props.auth;
    const { populateCoinObjectWithAvatar } = this.props;

    // If user is logged out, return initial conlist [Bitcoin, Litecoin, Ethereum]
    // if (!nextProps.auth.isAuthenticated) {
    //   this.setState(
    //     {
    //       currencyArray: initialCoinList,
    //       walletValueDifference: "0.00",
    //       walletValue: 0
    //     },
    //     () => this.fetchRates()
    //   );
    // }

    // If user is logged in update component state with backend data
    // else if (
    //   portfolio.currencyArray.length !== this.state.currencyArray.length
    // ) {
    //   this.setState(
    //     {
    //       currencyArray: portfolio.currencyArray,
    //       myCoins: portfolio.myCoins,
    //       walletDifference: portfolio.walletDifference,
    //       walletValue: portfolio.walletValue
    //     },
    //     () => this.fetchRates()
    //   );
    // }

    // Once AllCoins return from Cryptocompare API, display them
    // if (nextProps.trade.myCoins !== this.props.trade.myCoins) {
    //   populateCoinObjectWithAvatar(
    //     myCoins,
    //     allCoins,
    //     currencyArray,
    //     isAuthenticated
    //   );
    // }
  }

  // Create a portfolio object to send it to Redux component state
  createUpdatedPortfolioObject = () => {
    const {
      currencyArray,
      myCoins,
      walletDifference,
      walletValue
    } = this.state;

    const updatedPortfolio = {
      currencyArray,
      myCoins,
      walletDifference,
      walletValue
    };
    return updatedPortfolio;
  };

  render() {
    return (
      <Fragment>
        <Wallet />
        <CoinListContainer />
        <AddCoin />
        <Footer />
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  trade: PropTypes.object.isRequired,
  updatePortfolio: PropTypes.func.isRequired,
  fetchRates: PropTypes.func.isRequired,
  updateRatesEvery10Sec: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  trade: state.trade
});

export default connect(
  mapStateToProps,
  {
    updatePortfolio,
    getAllCoinsWithAvatars,
    fetchRates,
    updateRatesEvery10Sec
  }
)(Dashboard);
