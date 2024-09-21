const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require("method-override");
const User = require("./server/models/user.js")

const passport = require("passport");
const LocalStrategy = require("passport-local");

const sessionOptions = {
    secret : "CookieBlogSecure",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};

// passport
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());  
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

const port = process.env.PORT || 8080;

require("dotenv").config();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(methodOverride("_method"));

app.use(cookieParser());
app.use(fileUpload());

// app.use((req, res, next) => {
//     res.locals.currUser = req.user;
// });

app.set("view engine", "ejs");
app.set("layout", "./layouts/main");

const recipeRoutes = require("./server/routes/recipeRoutes.js");
const userRoutes = require("./server/routes/userRoute.js");
app.use("/user", userRoutes);
app.use("/", recipeRoutes);

app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});
