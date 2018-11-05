const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Models
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Portfolio = require("../../models/Trade");

// Validation
const validateProfileInput = require("../../validation/profile");

// @ route     GET api/profile/
// @desc       Get current user's  profile
// @access     Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    // Response returns a user token with user info
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.profile = "There is no profile for this user";
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route      POST api/profile/
// @desc       Create or edit user's profile
// @access     Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
      // Return errors with status 400
      return res.status(400).json(errors);
    }

    // Get profile fields
    const profileFields = {};

    // Id, email and avatar are coming from the token
    profileFields.user = req.user.id;

    if (req.body.website || req.body.website === "")
      profileFields.website = req.body.website;
    if (req.body.location || req.body.location === "")
      profileFields.location = req.body.location;
    if (req.body.mostEmbarassingSong)
      profileFields.mostEmbarassingSong = req.body.mostEmbarassingSong;
    if (
      req.body.afterWorkYouCanFindMeAt ||
      req.body.afterWorkYouCanFindMeAt === ""
    )
      profileFields.afterWorkYouCanFindMeAt = req.body.afterWorkYouCanFindMeAt;
    if (
      req.body.whatWouldIDoWithMillion ||
      req.body.whatWouldIDoWithMillion === ""
    )
      profileFields.whatWouldIDoWithMillion = req.body.whatWouldIDoWithMillion;
    if (req.body.iWontShutUpAbout || req.body.iWontShutUpAbout === "")
      profileFields.iWontShutUpAbout = req.body.iWontShutUpAbout;
    if (req.body.myMostIrrationalFear || req.body.myMostIrrationalFear === "")
      profileFields.myMostIrrationalFear = req.body.myMostIrrationalFear;
    if (
      req.body.thingIWillNeverDoAgain ||
      req.body.thingIWillNeverDoAgain === ""
    )
      profileFields.thingIWillNeverDoAgain = req.body.thingIWillNeverDoAgain;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create and save profile
        new Profile(profileFields)
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(404).json(err));
      }
    });
  }
);

// @route   DELETE api/profile/
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() =>
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        Portfolio.findOneAndRemove({ user: req.user.id }).then(() =>
          res.json({ success: true })
        )
      )
    );
  }
);

module.exports = router;
