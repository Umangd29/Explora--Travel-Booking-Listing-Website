const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const User = require('../models/user.js');
const passport = require("passport");
const { saveRedirectUrl, isSignedUp, isValidEmail, isValidPassword} = require("../middleware.js");
const userController = require("../controllers/users.js");


router.route("/signup")
    .get(userController.renderSignupForm)
    .post(isValidEmail, isValidPassword, isSignedUp, wrapAsync(userController.signup));


router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true,}),
        userController.login);


router.get("/logout", userController.logout);

module.exports = router;
