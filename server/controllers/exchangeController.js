var Item = require( '../models/itemModel' );
var User = require( '../models/userModel' );
var users = require('./userController');
var items = require('./itemController');

exports.list = function( req, res ){

    Exchange.find({ }, function( err, exchange ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ exchange: exchange });
            
    })
}

exports.create = function( req, res ){

    var exchange = new Exchange({ 
    	senderItems: req.body.exchange.myItems,
		recipientItems: req.body.exchange.otherUserItems,
		recipient: req.body.otherUser.username,
		sender: req.user.username,
    	message: req.body.message, //this should be an array
    	accepted: { recipient:0, sender:0 }
    });

    exchange.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create exchange" });
        } 

        console.log("exchange added: " + exchange);
        res.status( 201 ).json( exchange );

    });
};