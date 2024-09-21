const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");

// signup
router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.signupSuccess);


// Login
router.route("/login")
.get(userController.renderLoginForm)
.post(passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login)



// Logout
router.get("/logout", userController.logout);

module.exports = router;
