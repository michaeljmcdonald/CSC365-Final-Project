'use strict';
const Http = new XMLHttpRequest();
const url='localhost:3000/';

let addMovie = function(movie) {
    Http.open("GET", url + "addMovie");
    Http.send();
}

document
    .addEventListener('addMovie', function(evt){
        console.log("hello");
    });