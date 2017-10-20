var LocalStrategy = require( 'passport-local' ).Strategy;
var User = require( '../app/models/userModel' );
var users = require('../app/controllers/userController');

module.exports = function( passport ){

    passport.use( 'login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function( req, username, password, done ){
        if ( username ){
            username = username.toLowerCase( );
        }

        process.nextTick(function( ){
            User.findOne({ 'username':  username }, function( err, user ){
                if( err ){
                    return done( err );
                }

                if( !user ){
                    return done( null, false, req.flash( 'msg', 'User not found' ));
                    
                }else if( !user.correctPassword( password ) ){
                    return done( null, false, req.flash( 'msg', 'Password incorrect' ));

                } else {
                    return done( null, user, req.flash('msg', "Welcome " + username + ", you have successfully logged in!"));
                }
            });
        });

    }));

    passport.use( 'signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function( req, username, password, done ){
        if( username ){ username = username.toLowerCase( ); }

        process.nextTick(function( ){

            var loggedIn = req.user
            if( !loggedIn ){
                User.findOne({ 'username': username }, function( err, user ){

                    if( err ){
                        return done(err);
                        console.log("err");

                    } else if( user ){
                        return done( null, false, req.flash('msg', 'That username is already taken.') );

                    } else if( !users.validEmail( req.body.email ) ){
                        return done( null, false, req.flash('msg', 'The email \"' + req.body.email + '\"" is invalid, please use format x@y.z') );

                    } else {

                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.email = req.body.email;
                        newUser.items = [];

                        newUser.save(function( err ){
                            if( err ){
                                return done( err );
                            }else{
                                return done( null, newUser, req.flash('msg', "Welcome " + username + ", you have successfully registered!") );
                            }
                        });
                    }

                });

            } else {
                return done( null, req.user );
            }

        });

    }));


    passport.serializeUser( function( user, done ){
        done( null, user.id );
    });

    passport.deserializeUser( function( id, done ){
        User.findById(id, function( err, user ){
            done( err, user );
        });
    });

};
