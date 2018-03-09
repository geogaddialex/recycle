var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User             = require('../models/user.server.model');
var configAuth       = require('./auth');

module.exports = function( passport ){

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('local-signup', new LocalStrategy({

        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true


    }, function(req, email, password, done) {

        process.nextTick(function() {

            User.findOne({ 'local.email' :  email }, function(err, user) {

                if( err ){
                    return done(err);
                }

                if( user ){

//deal with
                } else {

                    var newUser            = new User();

                    newUser.local.email      = email;
                    newUser.local.password      = newUser.generateHash(password);
                    newUser.local.name         = req.body.name

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });    

        });

    }));


    passport.use('local-login', new LocalStrategy({

        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true

    }, function(req, email, password, done) {


        User.findOne({ 'local.email' :  email }, function(err, user) {

            if (err)
                return done(err);

            if (!user){

                return done(null)

            }else if (!user.validPassword(password)){

                return done(null)
            }

            return done(null, user);
        });

    }));



    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true

    }, function( req, token, refreshToken, profile, done ){

        process.nextTick(function() {

            if (!req.user) {

                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    if( err ){
                        return done(err);
                    }

                    if( user ){

                        if (!user.facebook.token) {

                            user.facebook.token = token;
                            user.facebook.name  = profile.displayName

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user);

                    } else {

                        var newUser            = new User();

                        newUser.facebook.id    = profile.id;                  
                        newUser.facebook.token = token;                    
                        newUser.facebook.name  = profile.displayName;

                        newUser.save( function( err ){

                            if( err ){
                                throw err;
                            }

                            return done( null, newUser );
                        });
                    }

                });

            } else {    

                var user            = req.user;

                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.displayName;

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }
        });

    }));


    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true

    }, function( req, token, refreshToken, profile, done) {

        process.nextTick(function() {

            if (!req.user) {

                User.findOne({ 'google.id' : profile.id }, function(err, user) {

                    if( err ){
                        return done(err);
                    }

                    if( user ){

                        if (!user.google.token) {
                            
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = profile.emails[0].value;

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }
                        return done(null, user);

                    } else {

                        var newUser          = new User();

                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value;

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {

                var user            = req.user;

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = profile.emails[0].value;

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });


            }
        });

    }));

};

