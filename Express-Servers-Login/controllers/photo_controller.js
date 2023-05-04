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
    response.redirect('/login');
  }
}

let privateStorage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, './uploads')
  },
  filename: function (request, file, cb) {
    let userId = request.user._json.email;
    cb(null, userId+'-'+file.originalname.replace(' ', '-'));
  }
});
let privateUpload = multer({ storage: privateStorage });

router.get('/photos', loggedIn, function(request, response) {
  let photosArray = Photo.getSortedPhotos();

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("photo/gallery",{
    user: request.user,
    photos: photosArray
  });
});

router.get('/photos/new', loggedIn, function(request, response) {
  let photosArray = Photo.getSortedPhotos();
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("photo/photoUpload", {
    user: request.user,
    photos: photosArray
});
});

router.post('/photos', loggedIn, privateUpload.any(), async (request, response) => {
  let artistID = request.user;
  let photoDisplayName = request.body.photoDisplayName;
  let photoDescription = request.body.photoDescription;
  const file = request.files[0];
  if (!file) {
    const error = {
    'httpStatusCode' : 400,
    'message':'Please upload a file'
     }
    response.send(error);
  }
  let photoImage = await File.uploadFile(file);

  if(photoDisplayName&&photoImage&&photoDescription){
    console.log(photoDisplayName,photoImage,photoDescription)
    Photo.createPhoto(photoImage,photoDisplayName,photoImage,photoDescription);
    let photo = Photo.getPhoto(photoImage.filename);
    let user = request.user;
    Artist.addPhoto(user, photo);
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.redirect("/photos/"+photoDisplayName);
  }else{
    response.redirect('/error?code=400');
  }
});

router.get('/photos/:id', loggedIn, function(request, response) {
let id= request.params.id;
let photo = Photo.getPhoto(id);
console.log("id",id);

    if(photo){

      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render("photo/photoDetails",{
        user: request.user,
        photo: photo
      });
    }else{
      response.redirect('/error?code=404');
    }
  });

module.exports = router;
