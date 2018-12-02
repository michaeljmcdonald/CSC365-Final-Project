

const express = require("express"),
    app = express(),
    passport = require("passport"),
    TweetStrategy = require("passport-twitter").Strategy,
    authorizationConfig = require("./modules/authorizationConfig"),
    authorizationHandling = require("./modules/authorizationHandling"),
    request = require("request-promise"),
    Twit = require("twit"),
    movieModule = require("./modules/MovieManager");


app.set("view engine", "pug");
app.set("views", "views");

app.use(require("express-session")({
    "secret": "secret",
    "resave": false,
    "saveUninitialized": false
}));

app.use(passport.initialize());
app.use(passport.session());

const twit = new Twit({
    "consumer_key": 
    "consumer_secret": 
    "access_token": 
    "access_token_secret": 
});

const twitterKeys = {
    "consumerKey": authorizationConfig.TWITTER_CONSUMER_KEY,
    "consumerSecret": authorizationConfig.TWITTER_CONSUMER_SECRET,
    "callbackURL": "http://127.0.0.1:3000/auth/twitter/callback"
};

const twitterStrat = "twitter-auth";

passport.use(twitterStrat, new TweetStrategy(
    twitterKeys,
    (token, tokenSecret, profile, done) => {

        done(null, {
            profile,
            token,
            tokenSecret
        });

    }
));

passport.serializeUser((user, cb) => {

    cb(null, user);

});

passport.deserializeUser((obj, cb) => {

    cb(null, obj);

});

app.get("/main", (request, response) => {

    const allMovies = null;

    response.render("MoviePicker", {"allMovies": movieModule.getAllMovies(),
        "favoritedMovies": movieModule.getAllFavoritedMovies()});

});

app.use(express.static("resources"));

app.use(express.json());
app.use(express.urlencoded({
    "extended": true
}));

app.get("/auth/twitter", passport.authenticate(twitterStrat));

app.get("/auth/twitter/callback", passport.authenticate(twitterStrat, {
    "successRedirect": "/main",
    "failureRedirect": "/"
}));

app.get("/auth/logout", (request, response) => {

    request.logout();
    response.redirect("/");

});

app.get("/", (req, res) => {

    let allMovies = null;

    request(
        {
            "method": "GET",
            "url": "https://ghibliapi.herokuapp.com/films",
            "json": true
        },
        (error, response, movies) => {

            const status = response.statusCode;

            if (status >= 400) {

                res.status(400);
                res.send("Can't find movies!");

                return;

            }
            allMovies = movies;

        }

    ).then(() => {

        movieModule.storeAllMovies(allMovies);
        res.render("login", {
        });

    });

});

app.get("/Movie", (req, res) => {
    movieModule.addToFavorites(req.query.movie);

});

app.get("/AllCurrentFavorites", (req, res) => {

    res.send(movieModule.getAllFavoritedMovies());

});

app.delete("/Movie", (req, res) => {

    movieModule.removeFromFavorites(req.query.movie);

});

app.get("/", (req, res) => {

    res.render("moviepicker");

});

app.get("/tweet", (request, response) => {

    twit.post("statuses/update", {"status": request.query.movies});
    response.redirect("/");

});

app.get("/gallery", (req, res) => {

    res.render("gallery");

});

app.get("/studioghibli", (req, res) => {

    res.render("studioghibli");

});

const server = app.listen(3000, () => {

    console.log(`Server started on port ${server.address().port}`);

});

