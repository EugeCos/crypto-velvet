const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Models
const Portfolio = require("../../models/Trade");

// @ route     GET api/trade/
// @ desc      Get user's poretfolio
// @ access    Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Response returns a user token with user info
    Portfolio.findOne({ user: req.user.id })
      .populate("user", ["name"])
      .then(portfolio => res.json(portfolio))
      .catch(err => res.status(404).json(err));
  }
);

// @ route     POST api/trade/create-portfolio
// @ desc      Create empty portfolio object when user registers
// @ access    Private
router.post(
  "/create-portfolio",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Create fields
    const portfolioFields = {};
    portfolioFields.user = req.user.id;
    portfolioFields.currencyArray = [];
    portfolioFields.walletValue = 0;
    portfolioFields.walletDifference = "0.00";
    myCoins = [];

    Portfolio.findOne({ user: req.user.id }).then(portfolio => {
      if (!portfolio) {
        // Save empty portfolio
        new Portfolio(portfolioFields)
          .save()
          .then(portfolio => res.json(portfolio));
      } else {
        console.log("Empty portfolio already created");
      }
    });
  }
);

// @ route     POST api/trade/update-currency-array
// @ desc      Update User's currency array
// @ access    Private
router.post(
  "/update-currency-array",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { currencyArray: req.body },
      { new: true }
    )
      .then(portfolio => res.json(portfolio))
      .catch(err => console.log(err));
  }
);

// @ route     POST api/trade/update-my-coins-array
// @ desc      Update User's coin list
// @ access    Private
router.post(
  "/update-my-coins-array",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { myCoins: req.body },
      { new: true }
    )
      .then(updatedCoinsList => res.json(updatedCoinsList))
      .catch(err => console.log(err));
  }
);

// @ route     POST api/trade/update-wallet
// @ desc      Update User's wallet value
// @ access    Private
router.post(
  "/update-wallet",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body.walletDifference);
    Portfolio.findOneAndUpdate(
      { user: req.user.id },
      {
        walletValue: req.body.value,
        walletDifference: req.body.walletDifference
      },
      { new: true }
    )
      .then(updatedWalletValue => res.json(updatedWalletValue))
      .catch(err => console.log(err));
  }
);

// @ route     POST api/trade/update-wallet-value-difference
// @ desc      Update User's wallet value difference after rates have updated
// @ access    Private
router.post(
  "/update-wallet-value-difference",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { walletDifference: req.body.value },
      { new: true }
    )
      .then(updatedWalletValueDifference =>
        res.json(updatedWalletValueDifference)
      )
      .catch(err => console.log(err));
  }
);

module.exports = router;
