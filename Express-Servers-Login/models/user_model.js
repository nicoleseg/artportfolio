const fs = require('fs');

exports.createUser =  function (userID, firstName){
  let allUsers = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));
  //only add the user if the user doesn't already exist
  if(!allUsers[userID]){
    let newUser={
      "id":userID,
      "firstName": firstName,
      "dateJoined": new Date()
    }
    allUsers[userID] = newUser;
    fs.writeFileSync(__dirname+'/../data/users.json', JSON.stringify(allUsers));
    return true; //the user was new and needed to be created
  }

  return false; //the user already existed
}

exports.getUser =  function (userID){
  let allUsers = JSON.parse(fs.readFileSync(__dirname+'/../data/users.json'));

  if(allUsers[userID]){
    return allUsers[userID];
  }

  return {};
}
