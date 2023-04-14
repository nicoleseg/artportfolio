const express = require('express'),
  router = express.Router();

const Game = require('../models/game_model');
const Opponent = require('../models/opponent_model');
const Player = require('../models/player_model');

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


router.get('/play', loggedIn, function(request, response) {
    let opponents = Opponent.getOpponents();
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("game/play", {
      user: request.user,
      data: opponents
    });
});

router.get('/results', loggedIn, function(request, response) {
    let opponentName = request.query.opponent;
    let playerThrow = request.query.throw;
    if(Opponent.isOpponent(opponentName)){
      let playerID = request.user._json.email;
      let results = Game.playGame(opponentName, playerThrow);
      Opponent.updateOpponent(opponentName, results["outcome"]);
      Player.addGame(playerID, results);
      results["photo"] = Opponent.getOpponent(opponentName)["photo"];
      
      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render("game/results", {
        user: request.user,
        data: results
      });
    }else{
      response.redirect('/error?code=404');
    }
});

router.get('/recentGames', loggedIn, function(request, response) {
  let gamesArray = Game.getSortedGames();

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("game/recentGames",{
    user: request.user,
    games: gamesArray
  });
});

module.exports = router;
