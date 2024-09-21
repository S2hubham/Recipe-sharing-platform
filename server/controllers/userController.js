const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup");
};

module.exports.signupSuccess = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const regUser = await User.register(newUser, password);
        // Automatically log in the user after signup
        req.login(regUser, (err) => {
            if (err) {
                req.flash("error", "There was a problem with automatic login. Please try logging in.");
                return res.redirect("/user/signup");
            }
            req.flash("success", "Welcome! You have successfully signed up.");
            res.redirect("/");
        });
    } catch (err) {
        req.flash("error", err.message || "Sign up failed. Please try again.");
        res.redirect("/user/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login");
};

module.exports.login = async (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/";
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have successfully logged out.");
        res.redirect("/");
    });
};
