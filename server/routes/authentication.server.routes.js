var User = require( '../models/user.server.model' );
var express = require('express');

module.exports = function( passport ){

  var router = express.Router();


  router.get( '/user', function( req, res ){

    if( !req.user ){
      return res.status( 200 ).json({ user: "" });
    }
    res.status( 200 ).json({ user: req.user });

  });


  router.get( '/status', function( req, res ){

    if( !req.isAuthenticated() ){
      return res.status( 200 ).json({ authenticated: false });
    }
    res.status( 200 ).json({ authenticated: true });

  });


  router.get( '/logout', function( req, res ){

    req.logout();
    res.status( 200 ).json({
      status: 'Bye!'
    });
  })


  router.post( '/login', function( req, res, next ){

      passport.authenticate('local-login', function( err, user, info ){

          if( err ){
            return next( err );
          }

          if( !user ){
            
            return res.status(401).json({
              err: info
            });
          }

          req.logIn( user, function( err ){

              if( err ){

                return res.status( 500 ).json({
                  err: 'Could not log in user'
                });

              }

              res.status( 200 ).json(user);
          });

      })( req, res, next );
  });


  router.post('/register', function(req, res, next) {

      passport.authenticate('local-signup', function(err, user, info) {

          if ( err ){
            return res.status(500).json({ errors: "Could not create user" });
          }

          if ( !user ){
            return res.status(500).json({ errors: "Could not create user" });
          }

          req.login( user, loginErr => {

              if ( loginErr ){
                return next( loginErr );
              }

              return res.status( 201 ).json(user);

          });  

      })(req, res, next);
  });


// social account auth ----------------------------------------------------------------------


  // facebook -------------------------------
    router.get('/facebook', passport.authenticate('facebook'));

    router.get('/facebook/callback', passport.authenticate('facebook', {
        
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

  // google -------------------------------
    router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    router.get('/google/callback', passport.authenticate('google', {

        successRedirect : '/profile',
        failureRedirect : '/'
    }));


// link accounts ----------------------------------------------------------------------

    // locally --------------------------------

      router.post('/connect/local', function(req, res) {
          var user            = req.user;

          console.log("passed local info: " +   JSON.stringify(req.body,null,2))

          user.local.email    = req.body.email;
          user.local.name = req.body.name;
          user.local.password = user.generateHash(req.body.password)

          console.log("new user: " +   JSON.stringify( user,null,2 ))

          User.findByIdAndUpdate(user._id, { $set: user }, {new: true, runValidators: true}, (err, user) => {  

              if( err ){
                  console.log( "error: " + err );
                  return res.status(500).json({ errors: "Could not update user" });
              } 

              res.status( 200 ).json({ message: "User updated!", user });
          });
        
      });

    // facebook -------------------------------
        router.get('/connect/facebook', passport.authorize('facebook', { 

          scope : ['public_profile', 'email'] 

        }));

        router.get('/connect/facebook/callback', passport.authorize('facebook', {

            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // google ---------------------------------
        router.get('/connect/google', passport.authorize('google', {

          scope : ['profile', 'email']

        }));

        router.get('/connect/google/callback', passport.authorize('google', {

            successRedirect : '/profile',
            failureRedirect : '/'
        }));


// unlink accounts ----------------------------------------------------------------------


    // local -----------------------------------
    router.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.local.name = undefined;

        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    router.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


    // google ---------------------------------
    router.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });


  return router;
}