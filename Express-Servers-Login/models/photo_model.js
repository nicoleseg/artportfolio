const uuid = require('uuid');
const fs = require('fs');


exports.getAllPhotos =  function() {
  let allPhotos = JSON.parse(fs.readFileSync(__dirname+'/../data/photos.json'));
  return allPhotos;
}

exports.getSortedPhotos =  function() {
  let allPhotos = JSON.parse(fs.readFileSync(__dirname+'/../data/photos.json'));
  let results=[];

  for(photo in allPhotos){
    results.push(allPhotos[photo])
  }
  results.sort(function(a, b){
    return new Date(b.date) - new Date(a.date);
  });

  return results;
}

exports.getPhoto =  function(photoID) {
  let allPhotos = JSON.parse(fs.readFileSync(__dirname+'/../data/photos.json'));
  return allPhotos[photoID];
}

exports.createPhoto =  function (photoID, photoDisplayName, photoImage, photoDescription){
  let allPhotos = JSON.parse(fs.readFileSync(__dirname+'/../data/photos.json'));
  if(!allPhotos[photoID]){
    let newPhoto={
      "displayName": photoDisplayName,
      "image": photoImage,
      "description": photoDescription,
      "dateJoined": new Date()
    }
    allPhotos[photoID] = newPhoto;
    fs.writeFileSync(__dirname+'/../data/photos.json', JSON.stringify(allPhotos));
  }
}

exports.removePhoto = function(photoID){
  let allPhotos = JSON.parse(fs.readFileSync(__dirname+'/../data/photos.json'));
  if(allPhotos[photoID]) delete allPhotos[photoID];
  fs.writeFileSync(__dirname+'/../data/photos.json', JSON.stringify(allPhotos));
}
