const express = require('express'),
    router = express.Router();
  const multer = require('multer');
  const ejs = require('ejs');
  const fs = require('fs');
  const io = require( "socket.io" )();
  const socketapi = {
      io: io
  };
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
  if(photo&&artist){
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("artist/deletePhotoForm",{
        user:  request.user,
        photo: photo,
        artist:artist
    });
   }else{
    response.redirect('/error?code=404');
  }
});

router.post('/artists/:id/:photoID', loggedIn, async (request, response) => {
let ad = request.body.artistID;
let pd = request.body.photoDisplayName;
let photo = Photo.getPhoto(pd);
let artist = Artist.getArtist(ad);
console.log(artist)
    if(photo&&artist){
      Photo.removePhoto(pd);
      Artist.removePhoto(ad,pd);
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

  router.get('/artists/:id/:photoID/edit', loggedIn, function(request, response) {
    let id=request.params.id;
    let photoID=request.params.photoID;
    let artist = Artist.getArtist(id);
    let photo=Photo.getPhoto(photoID);
    if(photo&&artist){
      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render("artist/updatePhotoForm",{
          user:  request.user,
          photo: photo,
          artist:artist
      });
     }else{
      response.redirect('/error?code=404');
    }
  });

  router.post('/artists/:id/:photoID/u', loggedIn, async (request, response) => {
  let ad = request.body.artistID;
  let pd = request.body.photoDisplayName;
  let description = request.body.description;
  let photo = Photo.getPhoto(pd);
  let artist = Artist.getArtist(ad);
  console.log(artist)
      if(photo&&artist){
        Photo.updatePhoto(pd,description);
        Artist.updatePhoto(ad,pd,description);
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
