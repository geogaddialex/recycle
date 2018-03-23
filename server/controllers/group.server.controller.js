var Group = require( '../models/group.server.model' );
var Item = require( '../models/item.server.model' );


exports.list = function( req, res ){

    Group.find({ })
    .populate('members')
    .exec( function( err, groups ){

        if( err ){
            return res.status( 500 );
        }
        
        res.json(groups);
            
    })
}

exports.create = function( req, res ){

    var group = new Group( req.body );

    group.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status( 500 ).json({ errors: "Could not create exchange" });
        } 

        var socketio = req.app.get('socketio');
        socketio.sockets.emit('group.created', group);
        res.status( 201 ).json({ message: "Group successfully added!", group });

    });
};

exports.update = function( req, res ){

    Group.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true, runValidators: true}).
    populate('members conversation')
    .exec(function( err, group ){  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update group" });
        } 

        res.status( 200 ).json({ message: "Group updated!", group });
    });
};


exports.lookupGroup = function(req, res, next) {

    Group.findById( req.params.id )
    .populate({ 
     path: 'conversation',
     populate: {
       path: 'messages',
       model: 'Message',
       populate:{
        path: 'sender',
        model: 'User'
       }
     } 
    })
    .populate('members')
    .exec( function( err, group ){

        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve group" });
        }

        if( !group ){
            console.log( "No group found" );
            return res.status(404).json({ errors: "No such group" });
        } 
        
        req.group = group;
        next();
    });
}

exports.forUser = function( req, res ){

    var user = req.user;

    Group.find({ members: user })
    .exec( function( err, groups ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ groups: groups });
            
    })
}