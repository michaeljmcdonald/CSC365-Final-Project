'use strict';
const Http = new XMLHttpRequest();
const url='localhost:3000';

let addMovie = function(movie) {
    Http.open("GET", "/Movie?movie=" + movie);
    Http.send();
    location.reload();
};

let removeMovie = function(movie) {
    Http.open("DELETE", "/Movie?movie=" + movie);
    Http.send();
    location.reload();
};

function getFavorites() {
    let listOfMovies = [];
    let query = ''
    Http.open("GET", "/AllCurrentFavorites");
    Http.onload = function(){
        listOfMovies = Http.responseText;
        let movies = '';
        for (let i = 0; i < listOfMovies.length; i++){
            movies = movies + listOfMovies[i] + ", "
        };
        query = "My favs are: " + listOfMovies;
        tweet(query);        
    };
    Http.send(query);
};

function tweet(message) {
    let url = new URL(window.location.href);
    url.pathname = 'tweet';
    url.searchParams.set('movies', message);

    const ajax = new XMLHttpRequest();
    ajax.open('GET', url);
    ajax.send();
};

document
    .addEventListener('addMovie', function(evt){        
    });
    document.addEventListener('removeMovie', function(evt){        
    });