const express = require("express");
const { signup, login, logout } = require("../controllers/auth");
const { volunteerById } = require("../controllers/volunteer");
const { volunteerSignupValidator } = require("../validator/validator");

const router = express.Router();

// auth routes for Volunteer authentication

// sign up
router.post("/signup", volunteerSignupValidator, signup);

// login
router.post("/login", login);

// logging out
router.get("/logout", logout);

// app will execute volunteerByID 1st for any route containing the :volunteerId
router.param("volunteerId", volunteerById);

module.exports = router;
