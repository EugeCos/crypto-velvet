import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// -----------FRONT-END API-------------
import api from "../../api";

// ----------UTILITY FUNCITONS-----------
import { limitDecimals } from "../../utils/utils";

// --------------REDUX--------------
import { connect } from "react-redux";
import { store } from "../../store";
import { updatePortfolio } from "../../actions/authActions";

// --------COMPONENTS---------
import AddCoin from "./AddCoin/AddCoin";
import CoinListContainer from "./CoinListContainer/CoinListContainer";
import Wallet from "./Wallet/Wallet";
import Footer from "../Footer/Footer";

const initialCoinList = ["BTC", "ETH", "LTC"];

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      intervalIndex: 0, // Interval index is needed to kill updateRatesEvery10Sec()
      currencyArray: initialCoinList,
      allCoins: [],
      myCoins: [],
      walletValue: "0.00",
      walletValueDifference: "0.00"
    };
  }

  componentWillMount() {
    let intervalIndex = setInterval(() => this.updateRatesEvery10Sec(), 8000);

    this.setState({
      intervalIndex
    });
  }

  componentDidMount() {
    const { getTimeoutIntervalIndex } = this.props;
    getTimeoutIntervalIndex(this.state.intervalIndex);

    if (this.props.auth.isAuthenticated) {
      const portfolio = this.props.auth.user.portfolio;
      this.setState(
        {
          currencyArray: portfolio.currencyArray,
          myCoins: portfolio.myCoins,
          walletDifference: portfolio.walletDifference,
          walletValue: portfolio.walletValue
        },
        () => this.fetchRates()
      );
    } else {
      this.setState(
        {
          currencyArray: initialCoinList,
          walletValueDifference: "0.00",
          walletValue: 0
        },
        () => this.fetchRates()
      );
    }
    this.getAllCoinsAndAvatars();
  }

  componentWillReceiveProps(nextProps) {
    const portfolio = nextProps.auth.user.portfolio;
    if (!nextProps.auth.isAuthenticated) {
      this.setState(
        {
          currencyArray: initialCoinList,
          walletValueDifference: "0.00",
          walletValue: 0
        },
        () => this.fetchRates()
      );
    } else if (
      portfolio.currencyArray.length !== this.state.currencyArray.length
    ) {
      this.setState(
        {
          currencyArray: portfolio.currencyArray,
          myCoins: portfolio.myCoins,
          walletDifference: portfolio.walletDifference,
          walletValue: portfolio.walletValue
        },
        () => this.fetchRates()
      );
    }
  }

  fetchRates = () => {
    const { currencyArray } = this.state;
    let url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${currencyArray}&tsyms=USD`;

    if (currencyArray.length) {
      api
        .getRates(url)
        .then(res => {
          return res.json();
        })
        .then(myJson => {
          this.createExchangeRateObject(myJson);
        })
        .catch(error => console.log(error));
    } else {
      this.setState(
        {
          myCoins: []
        },
        () => this.displayAvatars()
      );
    }
  };

  createExchangeRateObject = rates => {
    let coinArrayCopy = [];

    for (let cur in rates.RAW) {
      const coin = rates.RAW[cur].USD;
      coinArrayCopy.push({
        name: cur,
        rateToUSD: limitDecimals(coin.PRICE),
        percentChange24Hr: `${coin.CHANGEPCT24HOUR.toFixed(2)}%`,
        high24Hr: limitDecimals(coin.HIGH24HOUR),
        low24Hr: limitDecimals(coin.LOW24HOUR),
        holding: 0,
        totalValue: "0.00"
      });
    }
    this.setState(
      {
        myCoins: coinArrayCopy
      },
      () => this.displayAvatars()
    );
  };

  getAllCoinsAndAvatars = () => {
    let coinListUrl = "https://min-api.cryptocompare.com/data/all/coinlist",
      // "https://cors-anywhere.herokuapp.com/https://min-api.cryptocompare.com/data/all/coinlist",
      allCoins = [];

    api
      .getAllCoins(coinListUrl)
      .then(res => {
        return res.json();
      })
      .then(myJson => {
        for (let cur in myJson.Data) {
          allCoins.push({
            name: cur,
            coinName: myJson.Data[cur].CoinName,
            avatar: `https://www.cryptocompare.com/${myJson.Data[cur].ImageUrl}`
          });
        }
      })
      .then(() =>
        this.setState(
          {
            allCoins
          },
          () => this.displayAvatars()
        )
      )
      .catch(err => console.log(err));
  };

  displayAvatars = () => {
    const { myCoins, allCoins, currencyArray } = this.state;
    const { auth } = this.props;
    const authStatus = auth.isAuthenticated;

    console.log(auth);
    let rates;
    if (myCoins) {
      rates = Array.from(myCoins);
    }

    if (currencyArray.length) {
      if (allCoins.length && myCoins.length) {
        myCoins.map((currency, index) => {
          let coinIndex = allCoins.findIndex(
            coin => coin.name === currency.name
          );
          rates[index].avatar = allCoins[coinIndex].avatar;
          rates[index].coinName = allCoins[coinIndex].coinName;
          return this.setState(
            {
              myCoins: rates
            },
            () =>
              store.dispatch(
                updatePortfolio(authStatus, this.createUpdatedPortfolioObject())
              )
          );
        });
      }
    }
  };

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

  addCoin = selectedCoin => {
    let newArray = this.state.currencyArray.slice();
    newArray.unshift(selectedCoin);
    this.setState(
      {
        currencyArray: newArray
      },
      () => this.fetchDataForNewCoins(selectedCoin)
    );
  };

  deleteCoin = (e, name) => {
    e.stopPropagation();
    const { myCoins, currencyArray } = this.state;

    let newCurrencyArray = currencyArray.slice(),
      newmyCoinsArray = myCoins.slice();

    let coinIndex = newCurrencyArray.indexOf(name);
    newCurrencyArray.splice(coinIndex, 1);
    newmyCoinsArray.splice(coinIndex, 1);

    this.setState(
      {
        currencyArray: newCurrencyArray,
        myCoins: newmyCoinsArray
      },
      () => this.updateWallet()
    );
  };

  fetchDataForNewCoins = coin => {
    const { myCoins, allCoins } = this.state;
    const { auth } = this.props;
    const authStatus = auth.isAuthenticated;

    let newCoin, coinArrayCopy, coinIndex;
    coinArrayCopy = Array.from(myCoins);
    coinIndex = allCoins.findIndex(coinFromList => coinFromList.name === coin);

    let url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coin}&tsyms=USD`;

    let ifError = () => {
      newCoin = {
        name: coin,
        rateToUSD: 0,
        percentChange24Hr: "N/a",
        high24Hr: "N/a",
        low24Hr: "N/a",
        holding: 0,
        totalValue: "0.00",
        avatar: allCoins[coinIndex].avatar,
        coinName: allCoins[coinIndex].coinName
      };
      coinArrayCopy.unshift(newCoin);
      this.setState({
        myCoins: coinArrayCopy
      });
    };

    api
      .getRates(url)
      .then(res => {
        return res.json();
      })
      .then(myJson => {
        // if (res.status === 200) {
        let response = myJson.RAW[coin].USD;
        if (myCoins.length) {
          newCoin = {
            name: coin,
            rateToUSD: limitDecimals(response.PRICE),
            percentChange24Hr: `${response.CHANGEPCT24HOUR.toFixed(2)}%`,
            high24Hr: limitDecimals(response.HIGH24HOUR),
            low24Hr: limitDecimals(response.LOW24HOUR),
            holding: 0,
            totalValue: "0.00",
            avatar: allCoins[coinIndex].avatar,
            coinName: allCoins[coinIndex].coinName
          };
          coinArrayCopy.unshift(newCoin);
          this.setState(
            {
              myCoins: coinArrayCopy
            },
            () =>
              store.dispatch(
                updatePortfolio(authStatus, this.createUpdatedPortfolioObject())
              )
          );
        } else {
          this.fetchRates();
        }
        // }
      })

      .catch(error => ifError());
  };

  tradeCoins = (numberOfTradedCoins, tradeValue, selectedCoinName) => {
    const { myCoins } = this.state;
    let coinArrayCopy = JSON.parse(JSON.stringify(myCoins));
    let coinIndex = myCoins.findIndex(coin => coin.name === selectedCoinName);
    let newArray = coinArrayCopy[coinIndex];

    newArray.holding = Number(newArray.holding) + numberOfTradedCoins;
    newArray.totalValue = Number(newArray.totalValue) + tradeValue;

    this.setState(
      {
        myCoins: coinArrayCopy
      },
      () => this.updateWallet()
    );
  };

  updateWallet = () => {
    const { myCoins } = this.state;
    const { auth } = this.props;
    const authStatus = auth.isAuthenticated;

    let coinArrayCopy = JSON.parse(JSON.stringify(myCoins));
    let walletValue = 0;
    coinArrayCopy.map(coin => {
      return (walletValue += Number(coin.totalValue));
    });

    this.setState(
      {
        walletValue
      },
      () =>
        store.dispatch(
          updatePortfolio(authStatus, this.createUpdatedPortfolioObject())
        )
    );
  };

  updateRatesEvery10Sec = () => {
    console.log("Update rates ran");
    const { myCoins, currencyArray } = this.state;
    let arrayWithUpdatedRates = Array.from(myCoins);
    let url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${currencyArray}&tsyms=USD`;

    if (currencyArray.length) {
      api
        .getRates(url)
        .then(res => {
          return res.json();
        })
        .then(myJson => {
          // if (res.status === 200) {
          arrayWithUpdatedRates.forEach(
            coin =>
              (coin.rateToUSD = limitDecimals(myJson.RAW[coin.name].USD.PRICE))
          );
          // }
        })

        .catch(error => console.log(error));
      this.setState(
        {
          myCoins: arrayWithUpdatedRates
        },
        () => this.checkWalletStatus()
      );
    }
  };

  checkWalletStatus = () => {
    const { myCoins, walletValue } = this.state;
    const { auth } = this.props;
    const authStatus = auth.isAuthenticated;

    let newPotentialWalletValue = 0;

    myCoins.map(coin => {
      return (newPotentialWalletValue += coin.rateToUSD * coin.holding);
    });

    let difference = (
      Math.abs(newPotentialWalletValue) - Math.abs(walletValue)
    ).toFixed(2);

    this.setState(
      {
        walletValueDifference: difference
      },
      () =>
        store.dispatch(
          updatePortfolio(authStatus, this.createUpdatedPortfolioObject())
        )
    );
  };

  render() {
    const {
      walletValue,
      walletValueDifference,
      myCoins,
      currencyArray,
      allCoins
    } = this.state;
    return (
      <Fragment>
        <Wallet
          walletValue={walletValue}
          walletValueDifference={walletValueDifference}
        />
        <CoinListContainer
          myCoins={myCoins}
          deleteCoin={this.deleteCoin}
          tradeCoins={this.tradeCoins}
          currencyArray={currencyArray}
        />
        <AddCoin allCoins={allCoins} addCoin={this.addCoin} />
        <Footer />
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  updatePortfolio: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { updatePortfolio }
)(Dashboard);
