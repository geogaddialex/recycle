var Tag = require( '../models/tag.server.model' );
var Item = require( '../models/item.server.model' );

exports.list = function( req, res ){

    Tag.find({ }).exec( function( err, tags ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ tags: tags });
            
    })
}

exports.create = function( req, res ){

    var tag = new Tag(req.body);

    tag.save( function( err ){
        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not create tag" });
        } 

        res.status( 201 ).json( tag );

    });
};

exports.delete = function( req, res ){

    var id = req.params.id;

    Tag.findByIdAndRemove(id, (err, tag) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not delete tag" });
        } 

        console.log("tag deleted: " + tag);
        res.status( 200 ).json({tag: tag});
    });

};

exports.update = function( req, res ){

    var id = req.params.id;

    Tag.findByIdAndUpdate(id, { $set: req.body }, (err, tag) => {  

        if( err ){
            console.log( "error: " + err );
            return res.status(500).json({ errors: "Could not update tag" });
        } 

        console.log("tag updated: " + tag);
        res.status( 200 ).json( tag );
    });
};


exports.getItems = function( req, res ){

    var tag = req.tag;

    Item.find({ tags: tag._id }).populate('owner tags').exec( function( err, items ){

        console.log( JSON.stringify( items, null, 2))

        if( err ){
            return res.status( 500 );
        }
        
        res.json({items: items});
            
    })
};


exports.lookupTag = function(req, res, next) {

    Tag.findOne({ 'name': req.params.tag }).exec( function( err, tag ){

        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve tag" });
        }

        if( !tag ){
            console.log( "No tag found" );
            return res.status(404).json({ errors: "No such tag" });
        } 
        
        req.tag = tag;
        next();
    });
  
}
