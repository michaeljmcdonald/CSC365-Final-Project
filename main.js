'use strict';
const express = require('express'),
	app = express(),
	request = require('request-promise'),
    movieModule = require('./modules/MovieManager');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static('resources'));

app.use(express.json()); // for parsing application/json
app.use(
	express.urlencoded({
		extended: true
	})
); // for parsing application/x-www-form-urlencoded

app.get('/moviePicker', function(req, res) {   
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

app.get('/Movie', function(req, res) {
    console.log(req.query.movie)
    movieModule.addToFavorites(req.query.movie);
});

app.get('/AllCurrentFavorites', function(req, res) {
    res.send(movieModule.getAllFavoritedMovies())
    
});

app.delete('/Movie', function(req, res) {
    console.log(req.query.movie)
    movieModule.removeFromFavorites(req.query.movie);
});


app.get('/moviePicker', function(req, res) {
	res.render('moviePicker');
});

app.get('/gallery', function(req, res) {
	res.render('gallery');
});

app.get('/', function(req, res) {
	res.render('login');
});

app.get('/studioghibli', function(req, res) {
	res.render('studioghibli');
});

const server = app.listen(3000, function() {
	console.log(`Server started on port ${server.address().port}`);
});

