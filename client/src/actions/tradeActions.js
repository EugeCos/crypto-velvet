import {
  GET_ALL_COINS_WITH_AVATARS,
  UPDATE_MY_COINS_LIST,
  UPDATE_CURRENCY_ARRAY,
  UPDATE_WALLET_VALUE,
  UPDATE_WALLET_VALUE_DIFFERENCE,
  GET_PORTFOLIO,
  PORTFOLIO_LOADING,
  CLEAR_TRADE_OBJECT
} from "./types";
import api from "../api";
import axios from "axios";
import { store } from "../store";
import { limitDecimals } from "../utils/utils";

// Get names and avatars of all coins in CryptoCompare database
export const getAllCoinsWithAvatars = () => dispatch => {
  let coinListUrl = "https://min-api.cryptocompare.com/data/all/coinlist",
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
      dispatch({
        type: GET_ALL_COINS_WITH_AVATARS,
        payload: allCoins
      })
    )
    .then(() => dispatch(populateCoinObjectWithAvatar()))
    .catch(err => console.log(err));
};

// Fetch exchange rates for user's coins
export const fetchRates = currencyArray => dispatch => {
  let url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${currencyArray}&tsyms=USD`;

  if (currencyArray.length) {
    api
      .getRates(url)
      .then(res => {
        return res.json();
      })
      .then(myJson => dispatch(createExchangeRateObject(myJson)))
      .catch(error => console.log(error));
  } else {
    dispatch({
      type: UPDATE_MY_COINS_LIST,
      payload: []
    });
  }
};

// Create a new object with various coin data for each coin. Part of fetchRates() function
export const createExchangeRateObject = rates => dispatch => {
  let newCoinsArray = [];
  let myCoins = store.getState().trade.myCoins;

  for (let cur in rates.RAW) {
    let existingHolding = 0,
      existingTotalValue = "0.00";

    // If there is a holding with totalValue, return that. Otherwise return 0.00
    myCoins.forEach(coin => {
      if (cur === coin.name) {
        existingHolding = coin.holding;
        existingTotalValue = coin.totalValue;
      }
    });

    const coin = rates.RAW[cur].USD;
    newCoinsArray.push({
      name: cur,
      rateToUSD: limitDecimals(coin.PRICE),
      percentChange24Hr: `${coin.CHANGEPCT24HOUR.toFixed(2)}%`,
      high24Hr: limitDecimals(coin.HIGH24HOUR),
      low24Hr: limitDecimals(coin.LOW24HOUR),
      holding: existingHolding,
      totalValue: existingTotalValue
    });
  }
  dispatch({
    type: UPDATE_MY_COINS_LIST,
    payload: newCoinsArray
  });
  dispatch(populateCoinObjectWithAvatar());
};

// Add coin names and avatars to each of User's coins
export const populateCoinObjectWithAvatar = () => dispatch => {
  const { allCoins, myCoins, currencyArray } = store.getState().trade;
  let rates;
  if (myCoins) {
    rates = Array.from(myCoins);
  }

  if (currencyArray.length) {
    if (allCoins.length && myCoins.length) {
      myCoins.forEach((currency, index) => {
        let coinIndex = allCoins.findIndex(coin => coin.name === currency.name);
        rates[index].avatar = allCoins[coinIndex].avatar;
        rates[index].coinName = allCoins[coinIndex].coinName;
      });
    }
  }
  dispatch({
    type: UPDATE_MY_COINS_LIST,
    payload: rates
  });
};

// Add a new coin
export const addCoin = selectedCoin => dispatch => {
  let newArray = [...store.getState().trade.currencyArray];
  const { isAuthenticated } = store.getState().auth;
  newArray.unshift(selectedCoin);

  // If user is logged in, post Currency Array to back end
  if (isAuthenticated) {
    axios
      .post("/api/trade/update-currency-array", newArray)
      .then(res =>
        dispatch({
          type: UPDATE_CURRENCY_ARRAY,
          payload: res.data.currencyArray
        })
      )
      .then(() => dispatch(fetchDataForNewCoins(selectedCoin)))
      .catch(err => console.log(err));
  }
  // If not logged in, post only to front end
  else {
    dispatch({
      type: UPDATE_CURRENCY_ARRAY,
      payload: newArray
    });
    dispatch(fetchDataForNewCoins(selectedCoin));
  }
};

// Fetch data for new coins from CryptoCompare API
export const fetchDataForNewCoins = coin => dispatch => {
  const { myCoins, allCoins, currencyArray } = store.getState().trade;
  const { isAuthenticated } = store.getState().auth;

  let newCoin, coinArrayCopy, coinIndex;
  coinArrayCopy = [...myCoins];
  coinIndex = allCoins.findIndex(coinFromList => coinFromList.name === coin);

  let url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coin}&tsyms=USD`;

  // If a coin exists in the database but has no data except name and avatar, add the following characteristics
  let ifCoinError = () => {
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

    // If user is logged in, post My Coins to back end
    if (isAuthenticated) {
      axios
        .post("/api/trade/update-my-coins-array", coinArrayCopy)
        .then(res =>
          dispatch({
            type: UPDATE_MY_COINS_LIST,
            payload: coinArrayCopy
          })
        )
        .catch(err => console.log(err));
    }
    // If not logged in, post only to front end
    else {
      dispatch({
        type: UPDATE_MY_COINS_LIST,
        payload: coinArrayCopy
      });
    }
  };

  api
    .getRates(url)
    .then(res => {
      return res.json();
    })
    .then(myJson => {
      // If coins' api call returns no data
      if (myJson.Response === "Error") {
        ifCoinError();
      }
      // If request is successful
      else {
        let response = myJson.RAW[coin].USD;

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

        // If user is logged in, post My Coins to back end
        if (isAuthenticated) {
          axios
            .post("/api/trade/update-my-coins-array", coinArrayCopy)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
        }
        // If not logged in, post only to front end
        else {
          dispatch({
            type: UPDATE_MY_COINS_LIST,
            payload: coinArrayCopy
          });
        }
        // } else {
        dispatch(fetchRates(currencyArray));
      }
    })
    .catch(error => console.log(error));
};

// Delete a coin
export const deleteCoin = name => dispatch => {
  const { myCoins, currencyArray } = store.getState().trade;
  const { isAuthenticated } = store.getState().auth;

  let newCurrencyArray = [...currencyArray],
    newMyCoinsArray = [...myCoins];

  let coinIndex = newCurrencyArray.indexOf(name);
  newCurrencyArray.splice(coinIndex, 1);
  newMyCoinsArray.splice(coinIndex, 1);

  if (isAuthenticated) {
    axios
      .post("/api/trade/update-currency-array", newCurrencyArray)
      .then(res =>
        dispatch({
          type: UPDATE_CURRENCY_ARRAY,
          payload: res.data.currencyArray
        })
      )
      .catch(err => console.log(err));

    axios
      .post("/api/trade/update-my-coins-array", newMyCoinsArray)
      .then(res =>
        dispatch({
          type: UPDATE_MY_COINS_LIST,
          payload: res.data.myCoins
        })
      )
      .then(res => dispatch(updateWallet(res.payload))) //
      .catch(err => console.log(err));
  } else {
    dispatch({
      type: UPDATE_CURRENCY_ARRAY,
      payload: newCurrencyArray
    });
    dispatch({
      type: UPDATE_MY_COINS_LIST,
      payload: newMyCoinsArray
    });
    dispatch(updateWallet(newMyCoinsArray));
  }
};

// Buy or sell coins
export const tradeCoins = (
  numberOfTradedCoins,
  tradeValue,
  selectedCoinName
) => dispatch => {
  const { myCoins } = store.getState().trade;
  const { isAuthenticated } = store.getState().auth;
  let coinArrayCopy = [...myCoins];
  let coinIndex = myCoins.findIndex(coin => coin.name === selectedCoinName);
  let newArray = coinArrayCopy[coinIndex];

  newArray.holding = Number(newArray.holding) + numberOfTradedCoins;
  newArray.totalValue = Number(newArray.totalValue) + tradeValue;

  if (isAuthenticated) {
    axios
      .post("/api/trade/update-my-coins-array", coinArrayCopy)
      .then(res =>
        dispatch({
          type: UPDATE_MY_COINS_LIST,
          payload: res.data.myCoins
        })
      )
      .catch(err => console.log(err));
  }

  dispatch({
    type: UPDATE_MY_COINS_LIST,
    payload: coinArrayCopy
  });
  dispatch(updateWallet(coinArrayCopy));
};

// Update wallet value
export const updateWallet = myCoins => dispatch => {
  let coinArrayCopy = [...myCoins];
  const { isAuthenticated } = store.getState().auth;
  const { walletValueDifference } = store.getState().trade;
  let walletValue = 0,
    walletDifferenceCopy = walletValueDifference;

  // If coinlist is empty, set walletDifference to 0.00 before sending it to backend
  if (myCoins.length === 0) {
    walletDifferenceCopy = "0.00";
  }

  coinArrayCopy.map(coin => {
    return (walletValue += Number(coin.totalValue));
  });

  if (isAuthenticated) {
    axios
      .post("/api/trade/update-wallet", {
        value: walletValue,
        walletDifference: walletDifferenceCopy
      })
      .then(res =>
        dispatch({
          type: UPDATE_WALLET_VALUE,
          payload: res.data.walletValue
        })
      )
      // If there are no coins in myCoins array, set frontend walletDifference to 0.00
      .then(() => {
        if (myCoins.length === 0) {
          dispatch({
            type: UPDATE_WALLET_VALUE_DIFFERENCE,
            payload: "0.00"
          });
        }
      })
      .catch(err => console.log(err));
  }

  dispatch({
    type: UPDATE_WALLET_VALUE,
    payload: walletValue
  });
};

// Update wallet difference value
export const checkWalletStatus = () => dispatch => {
  const { myCoins, walletValue } = store.getState().trade;
  const { isAuthenticated } = store.getState().auth;

  let newPotentialWalletValue = 0;

  myCoins.map(coin => {
    return (newPotentialWalletValue += coin.rateToUSD * coin.holding);
  });

  let difference = (
    Math.abs(newPotentialWalletValue) - Math.abs(walletValue)
  ).toFixed(2);

  if (isAuthenticated) {
    axios
      .post("/api/trade/update-wallet-value-difference", {
        value: difference
      })
      .then(res =>
        dispatch({
          type: UPDATE_WALLET_VALUE_DIFFERENCE,
          payload: res.data.walletDifference
        })
      )
      .catch(err => console.log(err));
  } else {
    dispatch({
      type: UPDATE_WALLET_VALUE_DIFFERENCE,
      payload: difference
    });
  }
};

// Check for rates' value updates every 10 seconds
export const updateRatesEvery10Sec = () => dispatch => {
  console.log("Update rates ran");
  const { myCoins, currencyArray } = store.getState().trade;
  const { isAuthenticated } = store.getState().auth;
  let arrayWithUpdatedRates = [...myCoins];
  let url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${currencyArray}&tsyms=USD`;

  if (currencyArray.length) {
    api
      .getRates(url)
      .then(res => {
        return res.json();
      })
      .then(myJson => {
        arrayWithUpdatedRates.forEach(coin => {
          if (coin.high24Hr !== "N/a") {
            coin.rateToUSD = limitDecimals(myJson.RAW[coin.name].USD.PRICE);
          }
        });
      })
      .then(() => {
        if (isAuthenticated) {
          axios
            .post("/api/trade/update-my-coins-array", arrayWithUpdatedRates)
            .then(res =>
              dispatch({
                type: UPDATE_MY_COINS_LIST,
                payload: res.data.myCoins
              })
            )
            .catch(err => console.log(err));
        } else {
          dispatch({
            type: UPDATE_MY_COINS_LIST,
            payload: arrayWithUpdatedRates
          });
        }
        dispatch(checkWalletStatus());
      })
      .catch(error => console.log(error));
  }
};

// ---------------- AUTH related actions -----------------
// Portfolio loading
export const setPortfolioLoading = () => {
  return {
    type: PORTFOLIO_LOADING
  };
};

// Create an empty portfolio object when user registers
export const createPortfolio = () => dispatch => {
  axios
    .post("/api/trade/create-portfolio")
    .then(res => dispatch(console.log(res)))
    .catch(err => console.log(err));
};

// Get portfolio of logged in user
export const getCurrentPortfolio = () => dispatch => {
  dispatch(setPortfolioLoading());
  axios
    .get("/api/trade")
    .then(res =>
      dispatch({
        type: GET_PORTFOLIO,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

export const clearTradeObject = () => dispatch => {
  dispatch({
    type: CLEAR_TRADE_OBJECT
  });
};
