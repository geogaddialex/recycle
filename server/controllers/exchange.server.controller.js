var Exchange = require( '../models/exchange.server.model' );
var Notification = require( '../models/notification.server.model' );

exports.lookupExchange = function(req, res, next) {

    var id = req.params.id;

    Exchange.findOne({ '_id': id })
    .populate('recipient sender items.sender items.recipient feedback.sender feedback.recipient conversation')
    .exec( function( err, exchange ){
        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve exchange" });
        }

        if( !exchange ){
            console.log( "No exchange found" );
            return res.status(404).json({ errors: "No such exchange" });
        } 
        
        req.exchange = exchange;
        next();
    });
  
}

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
    exchange.lastUpdatedBy = exchange.sender

    exchange.save( function( err ){

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create exchange" });
        } 

        exchange.populate("recipient", function(err, exchange) {

            createNotification( "A user has made you a new offer", "/exchange/"+exchange._id, exchange.recipient, req )

            var socketio = req.app.get('socketio');
            socketio.sockets.emit('exchange.created', exchange);        
            res.status( 201 ).json({ message: "Exchange successfully added!", exchange });

        });

        
    });
};

exports.update = function( req, res ){

    Exchange.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true, runValidators: true}) 
        .populate('recipient sender items.sender items.recipient conversation conversation.messages')
        .exec( function( err, exchange ){  

            if( err ){
                console.log( "error: " + err );
                return res.status(500).json({ errors: "Could not update exchange" });
            } 

            var notifyThisUser = exchange.lastUpdatedBy.equals( exchange.recipient._id ) ? exchange.sender : exchange.recipient
            var message = exchange.status==="Agreed" ? "Exchange agreed, swap items now!" : "One of your exchanges has been modified"

            createNotification( message, "/exchange/"+exchange._id, notifyThisUser, req )
            
            var socketio = req.app.get('socketio');
            socketio.sockets.emit('exchange.updated', exchange);
            res.status( 200 ).json({ message: "Exchange updated!", exchange });
    });
};

exports.forUser = function( req, res ){

    var user = req.user;

    Exchange.find({$or:[{recipient: user},{sender: user}]}).populate('sender recipient items.recipient items.sender feedback.sender feedback.recipient conversation conversation.messages').exec( function( err, exchanges ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ exchanges: exchanges });
            
    })
}

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