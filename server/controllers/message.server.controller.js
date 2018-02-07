var Message = require( '../models/message.server.model' );

exports.list = function( req, res ){

    Message.find({ }).populate('owner').exec( function( err, messages ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ messages: messages });
            
    })
}

exports.create = function( req, res ){

    var message = new Message({ content: req.body.content, sender: req.body.sender, recipient: req.body.recipient });

    message.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create message" });
        } 

        message.populate("sender", function(err, message) {

            res.status( 201 ).json( message );

        });

    });
};

exports.delete = function( req, res ){

    var id = req.params.id;

    Message.findByIdAndRemove(id, (err, message) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not delete message" });
        } 

        console.log("message deleted: " + message);
        res.status( 200 ).json( message );
    });

};

exports.update = function( req, res ){

    var id = req.params.id;

    Message.findByIdAndUpdate(id, { $set: req.body }, (err, message) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update message" });
        } 

        console.log("message updated: " + message);
        res.status( 200 ).json( message );
    });
};

exports.lookupMessage = function(req, res, next) {

    var id = req.params.id;

    Message.findOne({ '_id': id }).populate('owner').exec( function( err, message ){

        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve message" });
        }

        if( !message ){
            console.log( "No message found" );
            return res.status(404).json({ errors: "No such message" });
        } 
        
        req.message = message;
        next();
    });
  
}
