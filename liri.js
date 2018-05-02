//========================= Require vars ===============================

require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');


//======================== Command Line ===============================


var procssArg = process.argv;

var action = process.argv[2];

var userArg = "";

for (var i = 3; i < procssArg.length; i++) {
    userArg += procssArg[i];
}


//====================== Switch command =====================================


switch (action) {
    case "my-tweets":
        tweets();
        break;
    
    case "spotify-this-song":
        if (userArg) {
            getSpotify(userArg);
        } else {
            getSpotify("The Sign Ace of Base");
        }
        break;

    case "movie-this":
        if (userArg) {
            omdb(userArg);
        } else {
            omdb("Mr. Nobody")
        }
        break;

    case "do-what-it-says":
        say();
        break;

    default:
        console.log("Please enter one of the following commands:\nmy-tweets, \nspotify-this-song (enter in quotes), \nmovie-this (enter in quotes), \ndo-what-it-says")
}


//====================== Call 20 recent tweets with creation date =====================================


function tweets() {
    var client = new Twitter(keys.twitter);
    var params = {screen_name: "@AbigailIsNotMe", count: 20}
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log("See your most recent tweets below:")
            for (var i=0; i<tweets.length; i++) {
                console.log("-------------------------------------------")
                console.log("Tweet: " + tweets[i].text)
                console.log("Creation date: " + tweets[i].created_at)
            }
        } else {
            console.log("Tweet load error")
        }
    });
}


//====================================== Call spotify info =============================================


function getSpotify(userArg) {
    var spotify = new Spotify(keys.spotify);
    spotify.search({type: 'track', query: userArg}, function(err, data) {
        if (!err) {
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name);            
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Spotify Preview Link: " + data.tracks.items[0].preview_url);   
        } else {
            console.log("Song info load error")
        }
    });
}


//================================= OMDB Movie ===========================================


function omdb(userArg) {
    var request = require('request');
    request("http://www.omdbapi.com/?t=" + userArg + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Relase Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            console.log("Country of filming: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}


//=============================== do-what-it-says =======================================
//============================= FS to call txt file ===============================


function say() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        } else {
            var output = data.split(",");     
            getSpotify(output[1]);      
        }
    });
}


//=====================================================================