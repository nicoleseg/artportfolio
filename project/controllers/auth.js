const express = require('express'),
  router = express.Router();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const KEYS = require('../config/keys.json');
//keeping our secrets out of our main application is a security best practice
//we can add /config/keys.json to our .gitignore file so that we keep it local/private
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/loggin.db');

let userProfile; //only used if you want to see user info beyond username

const Artist = require('../models/artist_model');
const Log = require('../models/log_model');

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
     let email=request.user._json.email.toString();
     let artistID = "";
    for(let i = 0; i < email.length; i++){
    if(email[i] !== "."){
      artistID += email[i];
      }
    }
   // Get the current timestamp
   let openAt = new Date().toString();
   Artist.createArtist(artistID, email.split('.')[0],email);//only creates if not in artists.json
   let userTracked= JSON.stringify(Log.tracklogin(artistID,openAt))
   console.log(userTracked)
   let artistArray = Artist.getSortedArtists();
   if(Artist.isAdmin(artistID)){
     response.render("artist/stats",{
         user: request.user,
         userTracked:userTracked,
         artists: artistArray
     });
   }else{
   response.redirect('/');
 }
  });

router.get("/auth/logout", (request, response) => {
  request.logout();
  response.redirect('/');
});

module.exports = router;
