var Exchange = require( '../models/exchange.server.model' );
var Notification = require( '../models/notification.server.model' );

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

            var socketio = req.app.get('socketio');
            socketio.sockets.emit('exchange.created', exchange);

            createNotification( "A user has made you a new offer", "/exchange/"+exchange._id, exchange.recipient, req )
        
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
            var socketio = req.app.get('socketio');
            socketio.sockets.emit('exchange.updated', exchange);


            var notifyThisUser = exchange.lastUpdatedBy.equals( exchange.recipient._id ) ? exchange.sender : exchange.recipient

            if( exchange.status==="Agreed"){

                createNotification( "Exchange agreed, swap items now!", "/exchange/"+exchange._id, notifyThisUser, req )
            
            }else{

                createNotification( "One of your exchanges has been modified", "/exchange/"+exchange._id, notifyThisUser, req )

            }

            res.status( 200 ).json( exchange );
    });
};

var createNotification = function( message, link, user, req ){


    var notification = new Notification({

        user: user,
        message: message,
        link: link

    })

    notification.save( function( err ){

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create notification" });
        } 

        var socketio = req.app.get('socketio');
        socketio.sockets.emit('notification.created', notification);

    });



}