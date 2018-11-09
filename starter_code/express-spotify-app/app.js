var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');

app.use(express.static(__dirname+"/public"));

app.set("view engine", "hbs");

// Remember to paste your credentials here
var clientId = "655b3e4f7bf1480d904f15ff64cc3eba",
    clientSecret = "33abb30ecead42a29fe0aae92b15aca6";

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret,
});

app.listen(3000, ()=> {
    console.log("3,2,1 LIFT OFF 🚀 🚀 🚀 !")
});



// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get("/", (request, response, next)=>{
    response.render("home-page.hbs");
})

app.get("/artists", (request, response, next)=>{
    const search_artist = request.query.search_query;

    spotifyApi.searchArtists(search_artist)
    .then(data =>{
        const allArtistsData = data.body.artists.items
        
        response.locals.artistsData = allArtistsData;

        response.render("artists.hbs");
    })
    .catch(err => {
      console.log("Error type",err)
    })  
})


app.get("/albums/:artistId", (request, response, next)=>{
    const artistId = request.params.artistId;

    spotifyApi.getArtistAlbums(artistId)
    .then(
        (data) => {

            spotifyApi.getArtist(artistId)
            .then(data2 => {
                response.locals.albumArtist = data2.body;
                response.render("albums.hbs");
            })
        allAlbumsData = data.body.items
        response.locals.albumsData = allAlbumsData;
        },
        (err) => {
          console.error(err);
        }
      );   
})


app.get("/tracks/:albumId", (request, response, next)=>{
    const albumId = request.params.albumId;

    spotifyApi.getAlbumTracks(albumId, { limit : 5, offset : 1 })
    .then(function(data) {
        const allAlbumTracks = data.body.items
        response.locals.albumTracks = allAlbumTracks;
      response.render("tracks.hbs")
    }, function(err) {
      console.log('Something went wrong!', err);
    });
})


app.get("/test", (request, response, next)=>{

    spotifyApi.getAlbumTracks("6KSvWFf4g4PrIldtchJsTC", { limit : 5, offset : 1 })
    .then(function(data) {
      response.send(data)
    }, function(err) {
      console.log('Something went wrong!', err);
    });
})