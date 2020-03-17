const jwt = require('jsonwebtoken');
require('dotenv').config();

const expressJwt = require('express-jwt');

const Volunteer = require("../models/volunteer-auth");

const _ = require('lodash');

// signup controller with the insertion -> save() on MongoDB

exports.signup = async (req, res) => {
  const volunteerExists = await Volunteer.findOne({ email: req.body.email });
  if (volunteerExists)
    return res.status(403).json({
      error: "Email is already taken! Try other please."
    });

  const volunteer = await new Volunteer(req.body);
  await volunteer.save();
  res.status(200).json({ message: "Signup was a success! Please login." });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  // find the volunteers email
  Volunteer.findOne({ email }, (err, volunteer) => {
    // if i get an error or a volunteer does not exist on db
    if (err || !volunteer) {
      return res.status(401).json({
        error: "A volunteer with this email does not exist. Please signup!"
      });
    }
    if (!volunteer.authenticate(password)) {
      return res.status(401).json({
        error: "This email and password do not match. Please try again!"
      });
    }
    // else ... Generate a token with the id and secret (defined on .env)
    const token = jwt.sign({ _id: volunteer._id }, process.env.JWT_SECRET);

    // persist the token on the cookie, for the current session until it expires
    res.cookie('t', token, { expire: new Date() + 9999 });

    // below we will return the response to the client, with a token created for him/her
    const { _id, firstName, lastName, email } = volunteer;
    return res.json({ token, volunteer: { _id, email, firstName, lastName } });
  });
};

// Logout by clearing user cookie -> invalidates the token previously create
// when the user did the login

exports.logout = (req, res) => {
  res.clearCookie("tkn");
  return res.json({ message: "Logout success!" });
};

// will protect routes
// IMPERATIVE TO USE userProperty (as a property from expressJwt)
// TO AVOID HOURS OF SEARCHING FOR ERRORS

exports.requireLogin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
});
