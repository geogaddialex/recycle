var Group = require( '../models/group.server.model' );
var Item = require( '../models/item.server.model' );


exports.getOne = function( req, res ){ 

    Group.findById( req.params.id )
    .populate('members')
    .exec( function( err, group ){

        if( err ){  
            return res.status(500).json({ errors: "Could not retrieve group" });
        }

        if( !group ){
            console.log( "No group found" );
            return res.status(404).json({ errors: "No such group" });
        } 

        res.status( 200 ).json( group );
        
    });
  
}


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
            return res.send(err);
        } 

        //should "modularize the socket transmission and abstract it into a factory", this is quick and dirty way
        var socketio = req.app.get('socketio'); // take socket instance from the app container
        socketio.sockets.emit('group.created', group);
        res.status( 200  ).json({ message: "Group successfully added!", group });

    });
};

exports.delete = function( req, res ){

    Group.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: "Group successfully deleted!", result });
    });


};

exports.update = function( req, res ){

    Group.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true}, (err, group) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update group" });
        } 

        res.status( 200 ).json({ message: "Group updated!", group });
    });
};


exports.getItems = function( req, res ){

    var group = req.group;

    Item.find({ owner : {$in : group.members }})
    .populate('owner')
    .exec( function( err, items ){

        console.log( JSON.stringify( items, null, 2 ) )

        if( err ){
            return res.status( 500 );
        }
        
        res.status( 200 ).json({ items: items });
            
    })
}

exports.lookupGroup = function(req, res, next) {

    Group.findOne({ '_id': req.params.id }, function( err, group ){
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