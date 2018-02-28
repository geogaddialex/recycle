var Notification = require( '../models/notification.server.model' );

exports.list = function( req, res ){

    Notification.find({user: req.user}).exec( function( err, notifications ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ notifications: notifications });
            
    })
}

exports.create = function( req, res ){

    var notification = new Notification( req.body );

    notification.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create notification" });
        } 

        var socketio = req.app.get('socketio');
        socketio.sockets.emit('notification.created', notification);

    });
};

exports.delete = function( req, res ){

    var id = req.params.id;

    Notification.findByIdAndRemove(id, (err, notification) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not delete notification" });
        } 

        console.log("notification deleted: " + notification);
        res.status( 200 ).json( notification );
    });

};

exports.update = function( req, res ){

    var id = req.params.id;

    Notification.findByIdAndUpdate(id, { $set: req.body }, {new: true}, (err, notification) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update notification" });
        } 

        var socketio = req.app.get('socketio');
        socketio.sockets.emit('notification.updated', notification);

        res.status( 200 ).json( notification );
    });
};
