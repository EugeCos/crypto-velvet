const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Models
const Portfolio = require("../../models/Trade");

// @ route     POST api/trade/create-portfolio
// @ desc      Create empty portfolio object when user registers
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

module.exports = router;
