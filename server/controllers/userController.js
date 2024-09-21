const User = require("../models/user")

module.exports.renderSignupForm = (req, res) => {
    res.render("signup");
}

module.exports.signupSuccess = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const regUser = await User.register(newUser, password);
        // after signup directly gets loggedin
        req.login(regUser, (err) => {
            if(err){
                res.redirect("signup");
            }
            res.redirect("/");
        })
    } catch (err) {
        res.redirect("signup");
    }
}
 

module.exports.renderLoginForm = (req, res) => {
    res.render("login");
}


module.exports.login = async (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}