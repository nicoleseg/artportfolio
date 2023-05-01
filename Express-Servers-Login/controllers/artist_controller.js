const express = require('express'),
  router = express.Router();

const Artist = require('../models/artist_model');

/*
  This is a function that allows us to avoid putting an
  if (loggedIn)... else (login)
  in every route. Instead, we include it as middleware and use
  next() to indicate that the next function in the chain of functions
  should be executed if the user is logged in
*/
function loggedIn(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.redirect('/artists');
  }
}


router.get('/artists', loggedIn, function(request, response) {
  let artistArray = Artist.getSortedArtists();

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("artist/allArtists",{
    user: request.user,
    artists: artistArray
  });
});

router.get('/artist/:artistName', loggedIn, function(request, response) {
  let artistName = request.params.artistName;
  let artist = Artist.getArtist(artistName);

  if(artist){
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("artist/artistDetails",{
      user: request.user,
      artist: artist
    });
  }else{
    response.redirect('/error?code=404');
  }
});

router.get('/artists/new', loggedIn, function(request, response) {
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("artist/artistCreate", {
      user: request.user
  });
  });

router.post('/artists', loggedIn, function(request, response) {
    let artistID = request.body.artistID;
    let artistDisplayName = request.body.artistDisplayName;
    if(artistDisplayName){
      Artist.createArtist(artistID,artistDisplayName);
      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.redirect("/artist/"+artistDetails);
    }else{
      response.redirect('/error?code=400');
    }
});

module.exports = router;
