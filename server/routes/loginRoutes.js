var User = require( '../models/userModel' );
var express = require('express');
var router = express.Router();
var passport = require('passport');

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


  router.post('/login', function( req, res, next ){

      passport.authenticate('local', function( err, user, info ){

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
            res.status( 200 ).json({
              status: 'Login successful!'
            });
          });

      })( req, res, next );
  });



  router.post( '/register', function( req, res ){

      var newUser = new User();
          newUser.username = req.body.username;
          newUser.password = "";
          newUser.email = req.body.email;
          newUser.isAdmin = false;
          newUser.items = [];

        User.register( newUser, req.body.password, function( err, account ){
          if( err ){
              return res.status( 500 ).json({
                err: err
              });
          }
          passport.authenticate( 'local' )( req, res, function(){
              return res.status( 200 ).json({
                status: 'Registration successful!'
              });
          });
        });
  });

  router.get( '/logout', function( req, res ){

    req.logout();
    res.status( 200 ).json({
      status: 'Bye!'
    });
  })


    // route for facebook authentication and login
    router.get('/facebook', passport.authenticate('facebook', { 
        
        scope : ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        
        successRedirect : '/profile',
        failureRedirect : '/'
    }));



module.exports = router;
