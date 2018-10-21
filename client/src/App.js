import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";

/*-------------FONT-AWESOME-------------*/
import "../node_modules/font-awesome/css/font-awesome.min.css";

// -------PRIVATE ROUTES WRAPPER-------
import PrivateRoute from "./components/Common/PrivateRoute";

// ----------COMPONENTS------------
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Signup from "./components/Auth/Signup/Signup";
import SignupSuccessful from "./components/Auth/SignupSuccessful/SignupSuccessful";
import Login from "./components/Auth/Login/Login";
import Profile from "./components/Profile/Profile";
import EditProfile from "./components/Profile/EditProfile/EditProfile";

// -------------CSS--------------
import "./App.css";
import "./css/global.less";

// -----------FRONT-END API-------------
import api from "./api";

// --------------REDUX--------------
import { store } from "./store";
import { connect } from "react-redux";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

// ----------UTILITY FUNCITONS-----------
import { limitDecimals } from "./utils/utils";
import setAuthToken from "./utils/setAuthToken";

// Check for token in Local Storage
if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;

  // Decode token and get user info and expiration
  const decoded = jwt_decode(token);

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Clear current user's profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = "/login";
  }

  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      intervalIndex: 0, // Interval index is need needed to kill updateRatesEvery10Sec()
      screenWidth: undefined,
      currencyArray: ["BTC", "ETH", "LTC"],
      allCoins: [],
      myCoins: [],
      walletValue: "0.00",
      walletValueDifference: "0.00"
    };
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
        () => this.displayAvatars(null)
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
      // if (res.status === 200) {

      // }
      // })
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
          return this.setState({
            myCoins: rates
          });
        });
      }
    }
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
          this.setState({
            myCoins: coinArrayCopy
          });
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
    let coinArrayCopy = JSON.parse(JSON.stringify(myCoins));
    let walletValue = 0;
    coinArrayCopy.map(coin => {
      return (walletValue += Number(coin.totalValue));
    });

    this.setState({
      walletValue
    });
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

  getTimeoutIntervalIndex = intervalIndex => {
    this.setState({
      intervalIndex
    });
  };

  stopUpdatingEvery10Seconds = () => {
    console.log("Update rates stopped");
    const { intervalIndex } = this.state;
    clearInterval(intervalIndex);

    this.setState({
      intervalIndex: 0
    });
  };

  checkWalletStatus = () => {
    const { myCoins, walletValue } = this.state;
    let newPotentialWalletValue = 0;

    myCoins.map(coin => {
      return (newPotentialWalletValue += coin.rateToUSD * coin.holding);
    });

    let difference = (
      Math.abs(newPotentialWalletValue) - Math.abs(walletValue)
    ).toFixed(2);

    this.setState({
      walletValueDifference: difference
    });
  };

  componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      this.setState({
        currencyArray: this.props.auth.user.portfolio.currencyArray
      });
    }
  }

  componentDidMount() {
    this.fetchRates();
    this.getAllCoinsAndAvatars();
  }

  render() {
    const {
      myCoins,
      allCoins,
      currencyArray,
      walletValue,
      walletValueDifference
    } = this.state;
    console.log(this.props.auth);
    return (
      <div className="App">
        <Navbar />
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Dashboard
                updateRatesEvery10Sec={this.updateRatesEvery10Sec}
                getTimeoutIntervalIndex={this.getTimeoutIntervalIndex}
                walletValue={walletValue}
                walletValueDifference={walletValueDifference}
                myCoins={myCoins}
                deleteCoin={this.deleteCoin}
                tradeCoins={this.tradeCoins}
                currencyArray={currencyArray}
                allCoins={allCoins}
                addCoin={this.addCoin}
              />
            )}
          />
          <Route
            exact
            path="/login"
            render={() => (
              <Login
                stopUpdatingEvery10Seconds={this.stopUpdatingEvery10Seconds}
              />
            )}
          />
          <Route
            exact
            path="/signup"
            render={() => (
              <Signup
                stopUpdatingEvery10Seconds={this.stopUpdatingEvery10Seconds}
              />
            )}
          />
          <Route
            exact
            path="/registration-successful"
            component={SignupSuccessful}
          />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps)(App));
