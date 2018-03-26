var User = require( '../models/user.server.model' );
var Item = require( '../models/item.server.model' );
var Exchange = require( '../models/exchange.server.model' );
var Feedback = require( '../models/feedback.server.model' );
var Group = require( '../models/group.server.model' );

exports.list = function( req, res ){

    User.find({ }, function( err, users ){

        users = Object.keys(users).map(function(key) {
            return users[key];
        });

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ users: users });
            
    })
}

exports.update = function( req, res ){

    var id = req.params.id;

    User.findByIdAndUpdate(id, { $set: req.body }, {new: true, runValidators: true}, (err, user) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update user" });
        } 

        res.status( 200 ).json({ message: "User updated!", user });
    });
};


exports.lookupUser = function(req, res, next) {

    var id = req.params.id;

    User.findOne({ '_id': id }).populate('location').exec( function( err, user ){
        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve user" });
        }

        if( !user ){
            console.log( "No user found" );
            return res.status(404).json({ errors: "No such user" });
        } 
        
        req.user = user;
        next();
    });
}

exports.lookupUserByEmail = function(req, res, next) {

    var email = req.params.email;

    User.findOne({ 'local.email': email }).populate('location').exec( function( err, user ){
        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve user" });
        }

        if( !user ){
            return res.status(404).json({ errors: "No such user" });
        } 
        
        req.user = user;
        next();
    });
}
