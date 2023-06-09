const fs = require('fs');

exports.getArtists = function(){
  let artists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  return artists;
}

exports.isArtist = function(artistID){
  let artists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  if(artists[artistID] && artists[artistID]["privileges"].indexOf("artist")>=0) return true;
  else return false;
}

exports.makeAdmin = function(artistID){
  let artists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  if(artists[artistID] && artists[artistID]["privileges"].indexOf("admin")<0) artists[artistID]["privileges"].push("admin");
  fs.writeFileSync(__dirname+'/../data/artists.json', JSON.stringify(allArtists));
}

exports.isAdmin = function(artistID){
  let artists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  if(artists[artistID] && artists[artistID]["privileges"].indexOf("admin")>=0) return true;
  else return false;
}

exports.getArtist = function(artistID){
  let artists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  return artists[artistID];
}

exports.getSortedArtists =  function() {
  let allArtists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  let results=[];

  for(artist in allArtists){
    results.push(allArtists[artist])
  }
  results.sort(function(a, b){
    return b - a;
  });

  return results;
}

exports.createArtist =  function (artistID, artistDisplayName, emailInfo){
  let allArtists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  if(!allArtists[artistID]){
    let newArtist={
      "id": artistID,
      "emailInfo": emailInfo,
      "displayName": artistDisplayName,
      "privileges": ["artist"],
      "photos": []
    }
    allArtists[artistID] = newArtist;
    fs.writeFileSync(__dirname+'/../data/artists.json', JSON.stringify(allArtists));
  }
}

exports.removeArtist = function(artistID){
  let allArtists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  if(allArtists[artistID]) delete allArtists[artistID];
  fs.writeFileSync(__dirname+'/../data/artists.json', JSON.stringify(allArtists));
}

exports.addPhoto = function(artistID, photo){
  let allArtists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  if(allArtists[artistID]){
    allArtists[artistID]["photos"].push(photo);
  }
  fs.writeFileSync(__dirname+'/../data/artists.json', JSON.stringify(allArtists));
}

exports.removePhoto = function(artistID, photo){
  let allArtists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  if(allArtists[artistID]["photos"][photo])delete allArtists[artistID]["photos"][photo];
  fs.writeFileSync(__dirname+'/../data/artists.json', JSON.stringify(allArtists));
}

exports.updatePhoto =  function (artistID,photoID, description){
  let allArtists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  if(allArtists[artistID]["photos"][photo]) allArtists[artistID]["photos"][photo]["description"][description];
  fs.writeFileSync(__dirname+'/../data/artists.json', JSON.stringify(allArtists));
}
