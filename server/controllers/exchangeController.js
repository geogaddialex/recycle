var Exchange = require( '../models/exchangeModel' );

//list exchanges for one user
//edit an exchange (accept, reject, modify, comment)

exports.list = function( req, res ){

    Exchange.find({ }).populate('messages').exec( function( err, exchanges ){

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

exports.update = function( req, res ){

    var id = req.params.id;

    Exchange.findByIdAndUpdate(id, { $set: req.body }, (err, exchange) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update exchange" });
        } 

        console.log("exchange updated: " + exchange);
        res.status( 200 ).json( exchange );
    });
};

exports.addMessage = function( req, res ){

    var id = req.params.id;

    console.log("messages = " + JSON.stringify( req.body ) )

    Exchange.findByIdAndUpdate(id, { $set: { messages: req.body } }, (err, exchange) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update messages" });
        } 

        console.log("messages updated: " + exchange.messages);
        res.status( 200 ).json( exchange.messages );
    });
};