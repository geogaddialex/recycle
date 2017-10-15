var User = require( '../models/userModel' );


exports.validEmail = function( email ){
	var match = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    
	return match.test( email );
};


exports.findUser = function( username ){

	User.findOne({ 'username':  username }, function( err, user ){
        if( err ){	
        	console.log( err ); 
            return false;
        }

        if( !user ){
            return false;

        } else {
            return user;
        }
    });
}

exports.findUserbyID = function( id ){

	User.findOne({ '_id':  id }, function( err, user ){
        if( err ){	
        	console.log( err ); 
            return false;
        }

        if( !user ){
            return false;
    
        } else {
            return user;
        }
    });
}

function loggedIn( req, res, next ) {
    if ( req.isAuthenticated() )
        return next( );
    res.redirect( '/login' );
}

function alreadyLoggedIn( req, res, next ) {
    if ( req.isAuthenticated() ){
        res.redirect( '/' );
    } else {
        return next( );
    }
}