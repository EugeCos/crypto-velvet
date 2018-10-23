import { GET_ALL_COINS_WITH_AVATARS } from "../actions/types";

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
    default:
      return state;
  }
}
