import axios from "axios";

export default {
  getRates: url => axios.get(url),
  getAllCoins: url => axios.get(url)
};
