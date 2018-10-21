const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Models
const User = require("../../models/User");
const Trade = require("../../models/Trade");

// @ route     POST api/trade/
// @desc       Create a portfolio upon user registration
// @access     Public
router.post("/", (req, res) => {
  const portfolioFields = {};
});

module.exports = router;
