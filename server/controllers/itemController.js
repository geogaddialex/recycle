var Item = require( '../models/itemModel' );
var User = require( '../models/userModel' );
var users = require('./userController');
var async = require('async');

exports.list = function( req, res ){

    Item.find({ }).populate({ path: 'owner' }).exec( function( err, items ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ items: items });
            
    })
}

exports.create = function( req, res ){

    var item = new Item({ name: req.body.name, owner: req.user });

    item.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create item" });
        } 

        console.log("item added: " + item);
        res.status( 201 ).json( item );

        // exports.addToUser( req.user, item, function( success ){

        //     if( success ){
                      
        //     } else {
        //         console.log( "yeah nah" )
        //     }
            
        // });  
    });
};

exports.addToUser = function( user, item, callback ){

    User.findByIdAndUpdate(
        user,               //id
        {$push: {items: item}},
        {safe: true, upsert: true},
        function( err, model ){
            if( err ){
                console.log( "error adding item to user: " + err );
            } else {
                callback( 1 );
            }
        }
    );
}

exports.findOwnerOfItem = function( id, callback ){
    exports.findItemByID( id, function( item ){
        users.findUserByID( item.owner, function( user ){
            callback();
        } )
    });
}
