var Exchange = require( '../models/exchangeModel' );

//list exchanges for one user
//edit an exchange (accept, reject, modify, comment)

exports.list = function( req, res ){

    Exchange.find({ }, function( err, exchanges ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ exchanges: exchanges });
            
    })
}

exports.create = function( req, res ){

    var exchange = new Exchange( req.body );

    exchange.save( function( err ){

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create exchange" });
        } 

        console.log("exchange added: " + exchange);
        res.status( 201 ).json( exchange );

    });
};