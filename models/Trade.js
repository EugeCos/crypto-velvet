const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PortfolioSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  currencyArray: [{ type: String }],
  walletValue: { type: Number },
  walletDifference: { type: String },
  myCoins: [
    {
      avatar: { type: String },
      name: { type: String },
      coinName: { type: String },
      high24Hr: { type: String },
      low24Hr: { type: String },
      percentChange24Hr: { type: String },
      rateToUSD: { type: Number },
      holding: { type: Number },
      totalValue: { type: Number },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = Portfolio = mongoose.model("portfolio", PortfolioSchema);
