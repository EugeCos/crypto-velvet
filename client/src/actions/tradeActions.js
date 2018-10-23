import { GET_ALL_COINS_WITH_AVATARS } from "./types";
import "../api";
import api from "../api";

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
    .catch(err => console.log(err));
};
