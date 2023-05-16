const express = require('express'),
  router = express.Router();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const KEYS = require('../config/keys.json');
//keeping our secrets out of our main application is a security best practice
//we can add /config/keys.json to our .gitignore file so that we keep it local/private
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('example.db');

let userProfile; //only used if you want to see user info beyond username

const Artist = require('../models/artist_model');

router.use(session({
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 600000 //600 seconds of login time before being logged out
  },
  secret: KEYS["session-secret"]
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: KEYS["google-client-id"],
    clientSecret: KEYS["google-client-secret"],
    callbackURL: "http://localhost:3000/auth/google/callback"
    //todo: port==process.env.PORT? :
  },
  function(accessToken, refreshToken, profile, done) {
    userProfile = profile; //so we can see & use details form the profile
    return done(null, userProfile);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*
  This triggers the communication with Google
*/
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email']
  }));

/*
  This callback is invoked after Google decides on the login results
*/
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/error?code=401'
  }),
  function(request, response) {
    // Insert seed data into the logs table
    db.serialize(() => {
      let email=request.user._json.email.toString();
      let artistID = "";
      for(let i = 0; i < email.length; i++){
      if(email[i] !== "."){
        if(email[i] !== "@trinityschoolnycorg"){
        artistID += email[i];
          }
        }
      }
     // Get the current timestamp
     const openAt = new Date().toISOString();
      // Drop the logs table if it exists
      db.run('DROP TABLE IF EXISTS logs');

      // Create the logs table
      db.run(`CREATE TABLE logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        artistID TEXT,
        open_at DATE DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`INSERT INTO logs (artistID, open_at) VALUES (?, ?)`, [artistID, openAt], (err) => {
        if (err) {
          console.error('Error inserting login record:', err);
        }

      });
      });
    // Close the database connection
    db.close();
  //  console.log(userProfile);

 // Insert the new login record into the logs table

    response.redirect('/');
  });

router.get("/auth/logout", (request, response) => {
  request.logout();
  let email=request.user._json.email.toString();
  let artistID = "";
  for(let i = 0; i < email.length; i++){
  if(email[i] !== "."){
    if(email[i] !== "@trinityschoolnycorg"){
    result += email[i];
      }
    }
  }
  Artist.createArtist(artistID, artistID.split('.')[0],email);//only creates if not in artists.json
  response.redirect('/');
});

module.exports = router;
