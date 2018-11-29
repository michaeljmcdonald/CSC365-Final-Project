'use strict';
const express = require('express'),
	app = express(),
	request = require('request-promise'),
    movieModule = require('./modules/MovieManager');
    express = require('express');
    passport = require('passport');
    Strategy = require('passport-twitter').Strategy;

var trustProxy = false;
if (process.env.DYNO) {
  
  trustProxy = true;
}

passport.use(new Strategy({
    consumerKey: process.env['TWITTER_CONSUMER_KEY'],
    consumerSecret: process.env['TWITTER_CONSUMER_SECRET'],
    callbackURL: '/oauth/callback/twitter.com',
    proxy: trustProxy
  },
  function(token, tokenSecret, profile, cb) {
    
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static('resources'));

app.use(express.json()); // for parsing application/json
app.use(
	express.urlencoded({
		extended: true
	})
); // for parsing application/x-www-form-urlencoded

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    console.log('ENV');
    console.log(process.env);
    console.log('Headers:');
    console.log(req.headers)
    res.render('login');
  });

app.get('/login/twitter',
  passport.authenticate('twitter'));

app.get('/oauth/callback/twitter.com',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
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
                res.render('MoviePicker', {
                    allMovies: movieModule.getAllMovies(),
                    favoritedMovies: movieModule.getAllFavoritedMovies()	
                })
        });
    
});

app.get('/addMovie', function(req, res) {
    console.log(req.query.movie)
    movieModule.addToFavorites(req.query.movie);
});

app.get('/', function(req, res) {
	res.render('moviepicker');
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