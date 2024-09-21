const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");
const wrapAsync = require("../../utility/wrapAsync.js");
const { saveRedirectUrl } = require("../../middleware.js");

// signup
router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signupSuccess));


// Login
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }), userController.login)



// Logout
router.get("/logout", userController.logout);

module.exports = router;
    