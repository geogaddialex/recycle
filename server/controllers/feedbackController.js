var Feedback = require( '../models/feedbackModel' );

exports.list = function( req, res ){

    Feedback.find({ }).populate('author').exec( function( err, feedback ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ feedback: feedback });
            
    })
}

exports.create = function( req, res ){

    var feedback = new Feedback({ author: req.body.author, comment: req.body.comment, rating: req.body.rating });

    feedback.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create feedback" });
        } 

        feedback.populate("sender", function(err, feedback) {

            res.status( 201 ).json( feedback );

        });

    });
};

exports.delete = function( req, res ){

    var id = req.params.id;

    Feedback.findByIdAndRemove(id, (err, feedback) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not delete feedback" });
        } 

        console.log("feedback deleted: " + feedback);
        res.status( 200 ).json( feedback );
    });

};

exports.update = function( req, res ){

    var id = req.params.id;

    Feedback.findByIdAndUpdate(id, { $set: req.body }, (err, feedback) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update feedback" });
        } 

        console.log("feedback updated: " + feedback);
        res.status( 200 ).json( feedback );
    });
};

exports.lookupFeedback = function(req, res, next) {

    var id = req.params.id;

    Feedback.findOne({ '_id': id }).populate('owner').exec( function( err, feedback ){

        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve feedback" });
        }

        if( !feedback ){
            console.log( "No feedback found" );
            return res.status(404).json({ errors: "No such feedback" });
        } 
        
        req.feedback = feedback;
        next();
    });
  
}
