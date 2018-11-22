'use strict';

let obj = {};

const allMovies = [];
const favoritesList = [];

obj.addMovie = function(movie) {
	ghibli.push();	
};

obj.getAllFavoritedMovies = function() {
	return favoritesList;
}

obj.getAllMovies = function() {
	return allMovies;
}

obj.storeAllMovies = function(movies) {
	if (allMovies.length == 0){
		movies.forEach(function(movie){
			allMovies.push(movie);
		});
	}
};

obj.addToFavorites = function(movie) {
	favoritesList.push(movie);
}

module.exports = obj;