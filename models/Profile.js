const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  mostEmbarassingSong: {
    type: String,
    required: true
  },
  afterWorkYouCanFindMeAt: {
    type: String
  },
  whatWouldIDoWithMillion: {
    type: String
  },
  iWontShutUpAbout: {
    type: String
  },
  myMostIrrationalFear: {
    type: String
  },
  thingIWillNeverDoAgain: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);

// Profile model
// 1.	User
// 2.	Website
// 3.	Location
// 4.	Most embarrassing song on Spotify
// 5.	After work you can find me at
// 6.	What I would do with a million dollars
// 7.	I won’t shut up about
// 8.	My most irrational fear is
// 9.	One thing I’ll never do again is
// 10.	Date
