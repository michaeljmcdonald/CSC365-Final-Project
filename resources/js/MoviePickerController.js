'use strict';
const Http = new XMLHttpRequest();
const url='localhost:3000/';

let addMovie = function(movie) {
    Http.open("GET", "/Movie?movie=" + movie);
    Http.send();
    location.reload();
}

let removeMovie = function(movie) {
    Http.open("DELETE", "/Movie?movie=" + movie);
    Http.send();
    location.reload();
}

let favTweet = function() {
    let movies = [];
    Http.open("GET", "/AllCurrentFavorites");    
    Http.send();
    Http.onreadystatechange = function(e){
        console.log(Http.responseText)
        movies = Http.responseText
    }
    console.log(movies)
    let listOfMovies = ""
    for (let i = 0; i < movies.length; i++){
        listOfMovies.append[movies[i] + ", "]
    }
    let body = {}
    body[status] = "My favs are: " + listOfMovies;
    Http.open("POST", "https://api.twitter.com/1.1/statuses/update.json");
    Http.send(body);    
}

document
    .addEventListener('addMovie', function(evt){        
    });

    document.addEventListener('removeMovie', function(evt){
        console.log('delete');
    });