const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  portfolio: {
    currencyArray: [{ type: String }],
    walletValue: { type: String },
    walletDifference: { type: String },
    myCoins: [
      {
        avatar: { type: String },
        name: { type: String },
        coinName: { type: String },
        high24Hr: { type: Number },
        low24Hr: { type: String },
        percentChange24Hr: { type: String },
        rateToUSD: { type: Number },
        holding: { type: Number },
        totalValue: { type: Number }
      }
    ]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
