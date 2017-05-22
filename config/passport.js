var configAuth = require('./auth');
var db = require('../db/config');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    console.log('IM HERE HERE HERE', user);
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    // db('facebook', 'google', 'twitter').where({id}).first()
    // .then((user) => { done(null, user); })
    // .catch((err) => { done(err,null); });
    done(null, user);
  });

  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(() => {
        db('facebook').where('id', profile.id).limit(1).then((user, err) => {
        
          if (err) {  
            return done(err);
          }
          if (user) {
            return done(null, user);
          } else {
            var names = profile.name.givenName + ' ' + profile.name.familyName;
            db('facebook').insert({
              id: profile.id,
              token: accessToken,
              name: names,
              email: profile.emails[0].value
            }).then(function (data, err) {
              if (err)
                throw err;
              return done(null, data);
            })
            console.log(profile);
          }
        })
      })
    }
  ));

  passport.use(new GoogleStrategy({
	    clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(() => {
        db('google').where('id', profile.id).limit(1).then((user, err) => {
          if (err) {  
            return done(err);
          }
          if (user) {
              console.log('USER FROM PASSPORT.JS', user)
            return done(null, user);
          } else {
            db('google').insert({
              id: profile.id,
              token: accessToken,
              name: profile.displayName,
              email: profile.emails[0].value
            }).then(function (data, err) {
                console.log('USER FROM PASSPORT.JS', user)
              if (err)
                throw err;
              return done(null, null);
            })
            console.log(profile);
          }
        })
      })
    }
  ));

  passport.use(new TwitterStrategy({
	    consumerKey: configAuth.twitterAuth.consumerKey,
      consumerSecret: configAuth.twitterAuth.consumerSecret,
      callbackURL: configAuth.twitterAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(() => {
        db('twitter').where('id', profile.id).limit(1).then((user, err) => {
          if (err) {  
            return done(err);
          }
          if (user) {
            return done(null, user);
          } else {
            db('twitter').insert({
              id: profile.id,
              token: accessToken,
              name: profile.username,
              displayName: profile.displayName
            }).then(function (data, err) {
              if (err)
                throw err;
              return done(null, null);
            })
            console.log(profile);
          }
        })
      })
    }
  ));

}