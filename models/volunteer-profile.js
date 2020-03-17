const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  age: { type: String },
  nationality: { type: String },
  about: { type: String, required: true },
  experience: { type: String, required: true },

  instagramURL: { type: String },
  facebookURL: { type: String },
  twitterURL: { type: String },
  linkedinURL: { type: String },

  profileImgName: { type: String },
  profileImgPath: { type: String }

});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
