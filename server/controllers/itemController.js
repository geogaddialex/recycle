var Item = require( '../models/itemModel' );
var User = require( '../models/userModel' );
var users = require('./userController');

exports.list = function( req, res ){

    Item.find({ }).populate('owner').exec( function( err, items ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ items: items });
            
    })
}

exports.create = function( req, res ){

    var item = new Item({ name: req.body.name, owner: req.user });

    item.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create item" });
        } 

        console.log("item added: " + item);
        res.status( 201 ).json( item );

    });
};

exports.delete = function( req, res ){

    var id = req.params.id;

    Item.findByIdAndRemove(id, (err, item) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not delete item" });
        } 

        console.log("item deleted: " + item);
        res.status( 200 ).json( item );
    });

};

exports.update = function( req, res ){

    var id = req.params.id;

    Item.findByIdAndUpdate(id, { $set: req.body }, (err, item) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update item" });
        } 

        console.log("item updated: " + item);
        res.status( 200 ).json( item );
    });
};

exports.lookupItem = function(req, res, next) {

    var id = req.params.id;

    Item.findOne({ '_id': id }).populate('owner').exec( function( err, item ){

        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve item" });
        }

        if( !item ){
            console.log( "No item found" );
            return res.status(404).json({ errors: "No such item" });
        } 
        
        req.item = item;
        next();
    });
  
}
