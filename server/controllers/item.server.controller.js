var Item = require( '../models/item.server.model' );


exports.getOne = function( req, res ){ 

    Item.findById( req.params.id ).populate('owner tags').exec( function( err, item ){

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

    Item.find({ }).populate('owner tags').exec( function( err, items ){

        if( err ){
            return res.status( 500 );
        }
        
        res.json({ items: items });
            
    })
}

exports.create = function( req, res ){

    var item = new Item(req.body);
    item.owner = req.user

    item.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.send(err);
        } 

        //should "modularize the socket transmission and abstract it into a factory", this is quick and dirty way
        var socketio = req.app.get('socketio'); // take socket instance from the app container
        socketio.sockets.emit('item.created', item);
        res.status( 200  ).json({ message: "Item successfully added!", item });

    });
};

exports.delete = function( req, res ){

    Item.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: "Item successfully deleted!", result });
    });


};

exports.update = function( req, res ){

    var id = req.params.id;

    Item.findByIdAndUpdate(id, { $set: req.body }, {new: true}, (err, item) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update item" });
        } 

        res.status( 200 ).json({ message: "Item updated!", item });
    });
};
