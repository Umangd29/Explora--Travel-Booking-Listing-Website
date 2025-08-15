if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

// Import dependencies
const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require('./routes/listings');
const reviewsRouter = require('./routes/reviews');
const userRouter = require('./routes/users');
const session = require("express-session");
const flash = require("connect-flash");
const LocalStrategy = require('passport-local');
const passport = require('passport');
const User = require('./models/user');
const MongoStore = require('connect-mongo');
const { error } = require("console");


const port = 8080;


// MIDDLEWARE SETUP
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SECRET,
    },
})

store.on(error, (err)=> {
    console.log("Error in MONGO SESSION STORE", err)
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
};

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
})

// DATABASE CONNECTION
async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("Wanderlust DB connected");
    })
    .catch((err) => {
        console.log("DB connection error:", err);
    });




app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.get("/", (req, res) => {
    res.redirect("/listings");
})


// * route
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


// error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong 🛑" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});


// START SERVER
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
