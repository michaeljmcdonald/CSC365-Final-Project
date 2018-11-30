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

document
    .addEventListener('addMovie', function(evt){        
    });

    document.addEventListener('removeMovie', function(evt){
        console.log('delete');
    });