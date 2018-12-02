var fs = require("fs");
var axios = require("axios");
var inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

// Use Inquire Module 
inquirer.prompt([
  {
    type: "list",
    message: "What Are You Looking For?",
    choices: ["spotify", "band", "omdb", "do-what-i-say"],
    name: "list"
  },
  {
    type: "input",
    message: "Enter Your spotify , omdb , band. ---  for do-what-i-say Just Click Enter",
    name: "search"
  }

]).then(function (inquirerResponse) {
  var option = inquirerResponse.list;

  switch (option) {
    case "spotify":
      var trackName = inquirerResponse.search;
      playSpotify(trackName);
      return;

    case "omdb":
      var movie = inquirerResponse.search;
      playOmdb(movie);
      return;

    case "band":
      var artist = inquirerResponse.search;
      playBand(artist);
      return;

    case "do-what-i-say":
      inquirer.prompt([
        {
          type: "list",
          message: "What Are You Looking For?",
          choices: ["spotify-this-song", "omdb-this-Movie", "bandsIntown-this-concern"],
          name: "list"
        }
      ]).then(function (inquirerResponse) {
        var playThis = inquirerResponse.list;

        fs.readFile("random.txt", "utf8", function (error, data) {
          if (error) {
            return console.log(error);
          }
          var dataFile = data.split(",");
          switch (playThis) {
            case "spotify-this-song":
              playSpotify(dataFile[0]);
              return;
            case "omdb-this-Movie":
              playOmdb(dataFile[1])
              return;
            case "bandsIntown-this-concern":
              playBand(dataFile[2]);
              return;
          }
        })
      })
  }
})

// Function Add Spotify MetaData TO Log File
function playSpotify(trackName) {
  spotify.search({ type: 'track', query: trackName }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var heading = "\n-------------------------------------- Spotify Search -----------------------------------------\n"
    var mySearchData = [
      "Artist: " + data.tracks.items[0].artists[0].name,
      "Song: " + data.tracks.items[0].name,
      "Spotify Link: " + data.tracks.items[0].external_urls.spotify,
      " Album Has The Song " + data.tracks.items[0].album.name
    ].join("\n\n");

    fs.appendFile("log.txt", heading + mySearchData, function (err) {
      if (err) throw err;
      else
        console.log("Data Has Been Save TO Your Log File");
    });
  });
}

// Function Add Movie MetaData TO Log File
function playOmdb(movie) {
  var apiKey = keys.omdb.apiKey;
  axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + apiKey).then(
    function (response) {
      var heading = "\n-------------------------------------- Omdb Search -----------------------------------------\n"
      var mySearchData = [
        "The movie's title is : " + response.data.Title,
        "The movie's Year is: " + response.data.Year,
        "The movie's IMDBrating is: " + response.data.imdbRating,
        "The movie's Country is: " + response.data.Country,
        "The movie's Language is: " + response.data.Language,
        "The movie's PLOT is: " + response.data.Plot,
        "The movie's Actors is: " + response.data.Actors
      ].join("\n\n");

      fs.appendFile("log.txt", heading + mySearchData, function (err) {
        if (err) throw err;
        else
          console.log("Data Has Been Save TO Your Log File");
      });
    }
  ).catch(
    function (err) {
      if (err) {
        console.log("sory Some Thing Running Wrong... Check Your Entry!.");
      }
    });
}

// Function Add Concern MetaData TO Log File
function playBand(artist) {
  var appId = keys.omdb.appId
  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + appId).then(
    function (responce) {
      var fullDate = responce.data[0].datetime;
      var d = new Date(fullDate);
      var shortDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
      var heading = "\n-------------------------------------- Band Search -----------------------------------------\n"
      var mySearchData = [
        "Name of the venue :  " + responce.data[0].venue.name,
        "Venue Country : " + responce.data[0].venue.country + " In " + responce.data[0].venue.city + " City",
        " Venue Date " + shortDate
      ].join("\n\n");

      fs.appendFile("log.txt", heading + mySearchData, function (err) {
        if (err)
          throw err;
        else
          console.log("Data Has Been Save TO Your Log File");
      });
    }).catch(
      function (err) {
        if (err) {
          console.log("sory Some Thing Running Wrong... Check Your Entry!.");
        }
      });
}
