const express = require('express'),
  router = express.Router();
  const multer = require('multer');
  const ejs = require('ejs');
  const fs = require('fs');

  const File = require('../models/file_model')
  const Photo = require('../models/photo_model');
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

router.get('/artists/:id', loggedIn, function(request, response) {
  let id=request.params.id;
  let artist = Artist.getArtist(id);
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

router.get('/artists/:id/:photoID', loggedIn, function(request, response) {
  let id=request.params.id;
  let photoID=request.params.photoID;
  let artist = Artist.getArtist(id);
  let photo=Photo.getPhoto(photoID);
  if(photo){
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("photo/photoDetails",{
        user: request.user,
        photo:photo
    });
   }else{
    response.redirect('/error?code=404');
  }
});

router.get('/artists/:id/:photoID/delete', loggedIn, function(request, response) {
  let id=request.params.id;
  let photoID=request.params.photoID;
  let artist = Artist.getArtist(id);
  let photo=Photo.getPhoto(photoID);
  if(photo){
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.redirect("/artists/:id/:photoID",{
      user: request.user,
      artist: artist
    });
   }else{
    response.redirect('/error?code=404');
  }
});

router.delete('/artists/:id/:photoID', loggedIn, function(request, response) {
let id= request.params.id
let photoID= request.params.photoID
let photo = Photo.getPhoto(photoID);
    if(photo){
      Photo.removePhoto(photoID);
      Artist.removePhoto(id,photoID);
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

module.exports = router;
