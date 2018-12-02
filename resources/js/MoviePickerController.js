'use strict';
const Http = new XMLHttpRequest();
const url='localhost:3000/';

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

let favTweet = function() {    
    let listOfMovies = [];
    let query = ''    
    Http.open("GET", "/AllCurrentFavorites");           
    Http.onload = function(){
        listOfMovies = Http.responseText;
        let movies = '';
        for (let i = 0; i < listOfMovies.length; i++){
            movies = movies + listOfMovies[i] + ", "
        };        
        //let body = {};
        query = "My favs are: " + listOfMovies;
        Http.open("POST", "/tweet?movies=" + query, true);
        //Http.send(query);      
        
        console.log(listOfMovies);                
    };
    //Http.open("POST", "/tweet?movies=" + query, true);
    Http.send(query);    
    //Http.open("POST", "/tweet?movies=" + query, true);
    //Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //Http.send(query);

    // Http.onload = function(){
    //     listOfMovies = Http.responseText;
    //     let movies = '';
    //     for (let i = 0; i < listOfMovies.length; i++){
    //         movies = movies + listOfMovies[i] + ", "
    //     };        
    //     //let body = {};
    //     let query = "My favs are: " + listOfMovies;
    //     Http.open("POST", "/tweet?movies=" + query);
    //     //Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //     Http.send();
        
    //     console.log(listOfMovies);    
    // };
    
    //console.log(listOfMovies);    
    //Http.send();
    //return;       
};

document
    .addEventListener('addMovie', function(evt){        
    });

    document.addEventListener('removeMovie', function(evt){        
    });