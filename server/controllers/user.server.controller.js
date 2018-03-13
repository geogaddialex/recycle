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

    User.findByIdAndUpdate(id, { $set: req.body }, (err, user) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update user" });
        } 

        res.status( 200 ).json( user );
    });
};

exports.listItems = function( req, res ){

    var user = req.user;

    Item.find({owner: user, removed: false })
    .populate('tags')
    .populate({ 
        path: 'owner',
        populate: {
            path: 'location',
            model: 'Location',
        } 
    })
    .exec( function( err, items ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ items: items });
            
    })
}

exports.listExchanges = function( req, res ){

    var user = req.user;

    Exchange.find({$or:[{recipient: user},{sender: user}]}).populate('sender recipient items.recipient items.sender feedback.sender feedback.recipient conversation conversation.messages').exec( function( err, exchanges ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ exchanges: exchanges });
            
    })
}

exports.listFeedback = function( req, res ){

    var user = req.user;

    Feedback.find({ subject: user }).populate( 'author' ).exec( function( err, feedback ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ feedback: feedback });
            
    })
}

exports.listGroups = function( req, res ){

    var user = req.user;

    Group.find({ members: user })
    .exec( function( err, groups ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ groups: groups });
            
    })
}

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

    User.findOne({ 'local.email' :  req.params.email }, function( err, user ){

        if( err ){  
            console.log( "Error: " + err ); 
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
