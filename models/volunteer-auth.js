const mongoose = require("mongoose");

const { v1: uuidv1 } = require("uuid");

const crypto = require("crypto");

const { ObjectId } = mongoose.Schema;


const volunteerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },

  email: { type: String, required: true, trim: true },
  hash_password: { type: String, required: true, trim: true },

  salt: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date
});

// Using virtual fields for hashing
// virtual (password won't be persisted in the DB)

volunteerSchema
  .virtual("password")
  .set(function(password) {
    // create a temporary _password variable
    this._password = password;
    // timestamp generator via npm i uuid
    this.salt = uuidv1();
    // encrypting the password
    this.hash_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// methods

volunteerSchema.methods = {
  // will see if the password matches the volunteer "signup" password once he/she wants to login
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) == this.hash_password;
  },

  encryptPassword: function(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("Volunteer", volunteerSchema);
