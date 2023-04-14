const express = require('express'),
  router = express.Router();

const artist = require('../models/artist_model');

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


router.get('/portfolios', loggedIn, function(request, response) {
  let opponentArray = Opponent.getSortedArtists();

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("artist/artistPortfolios",{
    user: request.user,
    opponents: opponentArray
  });
});

router.get('/opponent/:opponentName', loggedIn, function(request, response) {
  let opponentName = request.params.opponentName;
  let opponent = Opponent.getOpponent(opponentName);

  if(opponent){
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("opponent/opponentDetails",{
      user: request.user,
      opponent: opponent
    });
  }else{
    response.redirect('/error?code=404');
  }
});

router.get('/opponentCreate', loggedIn, function(request, response) {
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("opponent/opponentCreate", {
      user: request.user
    });
});

router.post('/opponentCreate', loggedIn, function(request, response) {
    let opponentName = request.body.opponentName;
    let opponentPhoto = request.body.opponentPhoto;
    if(opponentName&&opponentPhoto){
      Opponent.createOpponent(opponentName, opponentPhoto);
      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.redirect("/opponent/"+opponentName);
    }else{
      response.redirect('/error?code=400');
    }
});

module.exports = router;
