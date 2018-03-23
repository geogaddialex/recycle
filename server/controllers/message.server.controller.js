var Message = require( '../models/message.server.model' );


exports.create = function( req, res ){

    var message = new Message( req.body );

    message.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create message" });
        } 

        message.populate("sender", function(err, message) {

            res.status( 201 ).json({ successMessage: "Message successfully added!", message });

        });

    });
};

