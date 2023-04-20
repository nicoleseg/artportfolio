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
    response.redirect('/login');
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

router.get('/artistCreate', loggedIn, function(request, response) {
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("artist/artistCreate", {
      user: request.user
    });
});

router.post('/artistCreate', loggedIn, function(request, response) {
    let artistID = request.body.artistID;
    let artistDisplayName = request.body.artistDisplayName;
    let gradYear = request.body.gradYear;
    let artistStatement = request.body.artistStatement;
    if(artistName&&artistPhoto){
      Artist.createArtist(artistID,artistDisplayName, gradYear,artistStatement);
      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.redirect("/artist/"+artistName);
    }else{
      response.redirect('/error?code=400');
    }
});

module.exports = router;