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
    myCoins.map(coin => {
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
  const { isAuthenticated } = store.getState().auth;
  const { allCoins, myCoins, currencyArray } = store.getState().trade;
  let rates;
  if (myCoins) {
    rates = Array.from(myCoins);
  }

  if (currencyArray.length) {
    if (allCoins.length && myCoins.length) {
      myCoins.map((currency, index) => {
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
  newArray.unshift(selectedCoin);
  dispatch({
    type: UPDATE_CURRENCY_ARRAY,
    payload: newArray
  });
  dispatch(fetchDataForNewCoins(selectedCoin));
};

// Fetch data for new coins from CryptoCompare API
export const fetchDataForNewCoins = coin => dispatch => {
  const { myCoins, allCoins, currencyArray } = store.getState().trade;

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
    dispatch({
      type: UPDATE_MY_COINS_LIST,
      payload: coinArrayCopy
    });
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
          dispatch({
            type: UPDATE_MY_COINS_LIST,
            payload: coinArrayCopy
          });
        } else {
          dispatch(fetchRates(currencyArray));
        }
      }
    })
    .catch(error => console.log(error));
};

// Delete a coin
export const deleteCoin = name => dispatch => {
  const { myCoins, currencyArray } = store.getState().trade;

  let newCurrencyArray = [...currencyArray],
    newMyCoinsArray = [...myCoins];

  let coinIndex = newCurrencyArray.indexOf(name);
  newCurrencyArray.splice(coinIndex, 1);
  newMyCoinsArray.splice(coinIndex, 1);

  dispatch({
    type: UPDATE_CURRENCY_ARRAY,
    payload: newCurrencyArray
  });
  dispatch({
    type: UPDATE_MY_COINS_LIST,
    payload: newMyCoinsArray
  });
  dispatch(updateWallet(newMyCoinsArray));
};

// Buy or sell coins
export const tradeCoins = (
  numberOfTradedCoins,
  tradeValue,
  selectedCoinName
) => dispatch => {
  const { myCoins } = store.getState().trade;
  let coinArrayCopy = [...myCoins];
  let coinIndex = myCoins.findIndex(coin => coin.name === selectedCoinName);
  let newArray = coinArrayCopy[coinIndex];

  newArray.holding = Number(newArray.holding) + numberOfTradedCoins;
  newArray.totalValue = Number(newArray.totalValue) + tradeValue;

  dispatch({
    type: UPDATE_MY_COINS_LIST,
    payload: coinArrayCopy
  });
  dispatch(updateWallet(coinArrayCopy));
};

// Update wallet value
export const updateWallet = myCoins => dispatch => {
  let coinArrayCopy = [...myCoins];
  let walletValue = 0;

  coinArrayCopy.map(coin => {
    return (walletValue += Number(coin.totalValue));
  });

  dispatch({
    type: UPDATE_WALLET_VALUE,
    payload: walletValue
  });
};

// Update wallet difference value
export const checkWalletStatus = () => dispatch => {
  const { myCoins, walletValue } = store.getState().trade;

  let newPotentialWalletValue = 0;

  myCoins.map(coin => {
    return (newPotentialWalletValue += coin.rateToUSD * coin.holding);
  });

  let difference = (
    Math.abs(newPotentialWalletValue) - Math.abs(walletValue)
  ).toFixed(2);

  dispatch({
    type: UPDATE_WALLET_VALUE_DIFFERENCE,
    payload: difference
  });
};

// Check for rates' value updates every 10 seconds
export const updateRatesEvery10Sec = () => dispatch => {
  console.log("Update rates ran");
  const { myCoins, currencyArray } = store.getState().trade;
  let arrayWithUpdatedRates = [...myCoins];
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

    dispatch({
      type: UPDATE_MY_COINS_LIST,
      payload: arrayWithUpdatedRates
    });
    dispatch(checkWalletStatus());
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
