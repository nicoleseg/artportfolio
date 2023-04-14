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
    return new Date(b.date) - new Date(a.date);
  });

  return results;
}

exports.createArtist =  function (artistID, artistDisplayName){
  let allArtists = JSON.parse(fs.readFileSync(__dirname+'/../data/artists.json'));
  if(!allArtists[artistID]){
    let newArtist={
      "displayName": artistDisplayName,
      "gradYear": gradYear,
      "artistStatement": artistStatement,
      "emailInfo": emailInfo,
      "privileges": ["artist"],
      "photosIDs": [],
      "dateJoined": new Date()
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



