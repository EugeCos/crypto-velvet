import {
  GET_ALL_COINS_WITH_AVATARS,
  UPDATE_MY_COINS_LIST,
  UPDATE_CURRENCY_ARRAY,
  UPDATE_WALLET_VALUE,
  UPDATE_WALLET_VALUE_DIFFERENCE,
  GET_PORTFOLIO,
  CLEAR_TRADE_OBJECT,
  PORTFOLIO_LOADING
} from "../actions/types";

const initialState = {
  loading: false,
  allCoins: [],
  myCoins: [],
  currencyArray: ["BTC", "ETH", "LTC"],
  walletValue: "0.00",
  walletValueDifference: "0.00"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_COINS_WITH_AVATARS:
      return {
        ...state,
        allCoins: action.payload
      };
    case UPDATE_MY_COINS_LIST:
      return {
        ...state,
        myCoins: action.payload
      };
    case UPDATE_CURRENCY_ARRAY:
      return {
        ...state,
        currencyArray: action.payload
      };
    case UPDATE_WALLET_VALUE:
      return {
        ...state,
        walletValue: action.payload
      };
    case UPDATE_WALLET_VALUE_DIFFERENCE:
      return {
        ...state,
        walletValueDifference: action.payload
      };
    case GET_PORTFOLIO:
      return {
        ...state,
        loading: false,
        currencyArray: action.payload.currencyArray,
        myCoins: action.payload.myCoins,
        user: action.payload.user,
        walletValueDifference: action.payload.walletDifference,
        walletValue: action.payload.walletValue,
        id: action.payload._id
      };
    case CLEAR_TRADE_OBJECT:
      return {
        ...state,
        myCoins: [],
        currencyArray: ["BTC", "ETH", "LTC"],
        walletValue: "0.00",
        walletValueDifference: "0.00",
        user: null,
        id: null
      };
    case PORTFOLIO_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
