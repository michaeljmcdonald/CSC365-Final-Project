'use strict';
const express = require('express'),
    app = express(),
    passport = require("passport"),
    TweetStrategy = require("passport-twitter").Strategy,
    authorizationConfig = require("./modules/authorizationConfig"),
    authorizationHandling = require("./modules/authorizationHandling"),
    request = require('request-promise'),
    Twit = require('twit'),
    movieModule = require('./modules/MovieManager');


app.set('view engine', 'pug');
app.set('views', 'views');

app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

let twit = new Twit({
         
});

let twitterKeys = {
    consumerKey: authorizationConfig.TWITTER_CONSUMER_KEY,
    consumerSecret: authorizationConfig.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
};

let twitterStrat = "twitter-auth";
passport.use(twitterStrat, new TweetStrategy(twitterKeys,
    (token, tokenSecret, profile, done) => {
        done(null, {
            profile: profile,
            token: token,
            tokenSecret: tokenSecret
        });
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

//app.get("/", (request, response) => {
//    response.render("login");
//});

app.get("/main", (request, response) => {
    let allMovies = null;
    response.render("MoviePicker", {
        allMovies: movieModule.getAllMovies(),
        favoritedMovies: movieModule.getAllFavoritedMovies()});
    
});

app.use(express.static('resources'));

app.use(express.json()); 
app.use(
	express.urlencoded({
		extended: true
	})
); 

app.get("/auth/twitter", passport.authenticate(twitterStrat));

app.get("/auth/twitter/callback", passport.authenticate(twitterStrat, {
    successRedirect: "/main",
    failureRedirect: "/"
}));

app.get("/auth/logout", (request, response) => {
    request.logout();
    response.redirect("/");
});

app.get('/', function(req, res) {   
    let allMovies = null;
    request(
            {
                method: 'GET',
                url: `https://ghibliapi.herokuapp.com/films`,
                json: true
            },
            function(error, response, movies) {
                const status = response.statusCode;
                if (status >= 400) {
                    res.status(400);
                    res.send(`Can't find movies!`);
                    return;
                }

                //console.log(movies);
                allMovies = movies;
                
            }
            ).then(function () {
                movieModule.storeAllMovies(allMovies);
                res.render('login', {
                    //allMovies: movieModule.getAllMovies(),
                    //favoritedMovies: movieModule.getAllFavoritedMovies()	
                })
        });    
});

app.get('/Movie', function(req, res) {
    //console.log(req.query.movie)
    movieModule.addToFavorites(req.query.movie);
});

app.get('/AllCurrentFavorites', function(req, res) {
    res.send(movieModule.getAllFavoritedMovies())
    
});

app.delete('/Movie', function(req, res) {
    console.log(req.query.movie)
    movieModule.removeFromFavorites(req.query.movie);
});

app.get('/', function(req, res) {
	res.render('moviepicker');
});

app.post('/tweet', (request, response) => {
    twit.post('statuses/update', { status: request.query.movies });
    response.redirect('/');
    console.log(request.query.movies);
});

app.get('/gallery', function(req, res) {
	res.render('gallery');
});

app.get('/studioghibli', function(req, res) {
	res.render('studioghibli');
});

const server = app.listen(3000, function() {
	console.log(`Server started on port ${server.address().port}`);
});

