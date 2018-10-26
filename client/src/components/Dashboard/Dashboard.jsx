import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// --------------REDUX--------------
import { connect } from "react-redux";
import { updatePortfolio } from "../../actions/authActions";
import {
  getAllCoinsWithAvatars,
  fetchRates,
  updateRatesEvery10Sec,
  getCurrentPortfolio
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
    const {
      getTimeoutIntervalIndex,
      fetchRates,
      getCurrentPortfolio
    } = this.props;
    const { currencyArray } = this.props.trade;
    const { isAuthenticated } = this.props.auth;
    getTimeoutIntervalIndex(this.state.intervalIndex);

    if (isAuthenticated) {
      getCurrentPortfolio();
    }

    fetchRates(currencyArray);
  }

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
  updateRatesEvery10Sec: PropTypes.func.isRequired,
  getCurrentPortfolio: PropTypes.func.isRequired
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
    updateRatesEvery10Sec,
    getCurrentPortfolio
  }
)(Dashboard);
