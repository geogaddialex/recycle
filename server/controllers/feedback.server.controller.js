var Feedback = require( '../models/feedback.server.model' );

exports.create = function( req, res ){

    var feedback = new Feedback( req.body );

    feedback.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create feedback" });
        } 

        feedback.populate("sender", function(err, feedback) {

            res.status( 201 ).json({ message: "Feedback successfully added!", feedback });

        });

    });
};

exports.forUser = function( req, res ){

    var user = req.user;

    Feedback.find({ subject: user }).populate( 'author' ).exec( function( err, feedback ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ feedback: feedback });
            
    })
}
