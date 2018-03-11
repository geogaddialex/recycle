var Location = require( '../models/location.server.model' );

exports.list = function( req, res ){

    Location.find({ }).exec( function( err, locations ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ locations: locations });
            
    })
}
