var Exchange = require( '../models/exchangeModel' );

//list exchanges for one user
//edit an exchange (accept, reject, modify, comment)

exports.list = function( req, res ){

    Exchange.find({ })
        .populate('recipient sender items.sender items.recipient feedback')
        .populate({path: 'messages', populate: { path: 'sender' }})
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
            var socketio = req.app.get('socketio'); // take socket instance from the app container
            socketio.sockets.emit('exchange.created', exchange);

            console.log("exchange added: " + exchange);
            res.status( 201 ).json( exchange );

        });

        

    });
};

exports.update = function( req, res ){

    var id = req.params.id;

    Exchange.findByIdAndUpdate(id, { $set: req.body }, {new: true}) 
        .populate({path: 'messages', populate: { path: 'sender' }})
        .populate('recipient sender items.sender items.recipient')
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