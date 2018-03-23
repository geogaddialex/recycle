var Conversation = require( '../models/conversation.server.model' );

exports.create = function( req, res ){

    var conversation = new Conversation({ users: req.body.users, messages: [] });

    conversation.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create conversation" });
        } 

        conversation.populate("sender", function(err, conversation) {

            res.status( 201 ).json({ message: "Conversation successfully added!", conversation });

        });

    });
};


exports.update = function( req, res ){

    Conversation.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true})
    .populate({path: 'messages', populate: { path: 'sender' }})
    .exec( function(err, conversation){  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update conversation" });
        } 

        var socketio = req.app.get('socketio');
        socketio.sockets.emit('conversation.updated', conversation);

        res.status( 200 ).json({ message: "Conversation updated!", conversation });
    });
};

exports.lookupConversation = function(req, res, next) {

    Conversation.findOne({ '_id': req.params.id })
    .populate({path: 'messages', populate: { path: 'sender' }})
    .exec( function( err, conversation ){

        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve conversation" });
        }

        if( !conversation ){
            console.log( "No conversation found" );
            return res.status(404).json({ errors: "No such conversation" });
        } 
        
        req.conversation = conversation;
        next();
    });
  
}
