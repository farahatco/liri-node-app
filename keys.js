  require("dotenv").config();
  require("./.env");
  console.log('this is loaded');
var spotify =  {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
var omdb = {
  apiKey : process.env.OMDB_KEY
};
var band = {
  appId : process.env.BAND_APPID
}

module.exports = {
  spotify: spotify,
  omdb : omdb,
  band : band
};  