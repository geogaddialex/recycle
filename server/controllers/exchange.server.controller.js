var Exchange = require( '../models/exchange.server.model' );

exports.list = function( req, res ){

    Exchange.find({ })
        .populate('recipient sender items.sender items.recipient feedback feedback.sender feedback.recipient')
        .exec( function( err, exchanges ){

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

        exchange.populate("recipient", function(err, exchange) {

            //should "modularize the socket transmission and abstract it into a factory", this is quick and dirty way
            var socketio = req.app.get('socketio');
            socketio.sockets.emit('exchange.created', exchange);

            res.status( 201 ).json( exchange );

        });

        

    });
};

exports.update = function( req, res ){

    Exchange.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true}) 
        .populate('recipient sender items.sender items.recipient conversation conversation.messages')
        .exec( function( err, exchange ){  

            if( err ){
                console.log( "error: " + err );
                return res.status(500).json({ errors: "Could not update exchange" });
            } 

            //should "modularize the socket transmission and abstract it into a factory", this is quick and dirty way
            var socketio = req.app.get('socketio'); // take socket instance from the app container
            socketio.sockets.emit('exchange.updated', exchange);

            res.status( 200 ).json( exchange );
    });
};