var Item = require( '../models/item.server.model' );


exports.getOne = function( req, res ){ 

    Item.findById( req.params.id )
    .populate('tags')
    .populate({ 
        path: 'owner',
        populate: {
            path: 'location',
            model: 'Location',
        } 
    })
    .exec( function( err, item ){

        if( err ){  
            return res.status(500).json({ errors: "Could not retrieve item" });
        }

        if( !item ){
            console.log( "No item found" );
            return res.status(404).json({ errors: "No such item" });
        } 

        res.status( 200 ).json( item );
        
    });
  
}


exports.list = function( req, res ){

    Item.find({ removed: false })
    .populate('tags')
    .populate({ 
        path: 'owner',
        populate: {
            path: 'location',
            model: 'Location',
        } 
    })
    .exec( function( err, items ){

        if( err ){
            return res.status( 500 );
        }
        
        res.json({ items: items });
            
    })
}

exports.create = function( req, res ){

    var item = new Item(req.body);

    item.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create item" });
        } 

        var socketio = req.app.get('socketio');
        socketio.sockets.emit('item.created', item);
        res.status( 200 ).json({ message: "Item successfully added!", item });

    });
};

exports.delete = function( req, res ){

    Item.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: "Item successfully deleted!", result });
    });


};

exports.update = function( req, res ){

    var id = req.params.id;

    Item.findByIdAndUpdate(id, { $set: req.body }, {new: true, runValidators: true}, (err, item) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update item" });
        } 

        res.status( 200 ).json({ message: "Item updated!", item });
    });
};

exports.forUser = function( req, res ){

    var user = req.user;

    Item.find({owner: user, removed: false })
    .populate('tags')
    .populate({ 
        path: 'owner',
        populate: {
            path: 'location',
            model: 'Location',
        } 
    })
    .exec( function( err, items ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ items: items });
            
    })
}

exports.forGroup = function( req, res ){

    var group = req.group;

    Item.find({ owner : {$in : group.members }, removed: false})
    .populate('tags')
    .populate({ 
        path: 'owner',
        populate: {
            path: 'location',
            model: 'Location',
        } 
    })
    .exec( function( err, items ){

        if( err ){
            return res.status( 500 );
        }
        
        res.status( 200 ).json({ items: items });
            
    })
}

exports.forTag = function( req, res ){

    var tag = req.tag;

    Item.find({ tags: tag._id, removed: false })
    .populate('tags')
    .populate({ 
        path: 'owner',
        populate: {
            path: 'location',
            model: 'Location',
        } 
    }).exec( function( err, items ){

        if( err ){
            return res.status( 500 );
        }
        
        res.json({items: items});
            
    })
};

exports.forSearch = function( req, res ){

    var query = req.params.query

    Item.find({ name: { "$regex": query, "$options": "i" }, removed:false })
    .populate('tags')
    .populate({ 
        path: 'owner',
        populate: {
            path: 'location',
            model: 'Location',
        } 
    })
    .exec( function( err, items ){

        if( err ){
            return res.status( 500 );
        }
        
        res.json({ items: items });
            
    })

}
