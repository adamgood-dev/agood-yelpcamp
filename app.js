if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo");

const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require("./models/user");
const catchAsync = require("./utils/CatchAsync");
const ExpressError = require("./utils/ExpressError");
const CatchAsync = require("./utils/CatchAsync");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");

// Database Setup & Connection
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database Connected");
});

// Express Setup
const app = express();
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function(e) {
    console.log("Session store error", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
//app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dv5vm4sqh/" ];
 
app.use(
    helmet({
        contentSecurityPolicy: {
            directives : {
                defaultSrc : [],
                connectSrc : [ "'self'", ...connectSrcUrls ],
                scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
                styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
                workerSrc  : [ "'self'", "blob:" ],
                objectSrc  : [],
                imgSrc     : [
                    "'self'",
                    "blob:",
                    "data:",
                    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                    "https://images.unsplash.com/"
                ],
                fontSrc    : [ "'self'", ...fontSrcUrls ],
                mediaSrc   : [ "https://res.cloudinary.com/dlzez5yga/" ],
                childSrc   : [ "blob:" ]
            }
        },
        crossOriginEmbedderPolicy: false
    })
);



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routing

app.get("/", (req, res) => {
    res.render("Home");
})

app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", authRoutes);

// 404 Not Found Route
app.all("*", (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    // TODO: Make tidier error messaging for public viewing
    if (!err.message) err.message = "Uh oh, something went wrong.";
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})
