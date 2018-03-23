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

        res.status( 201 ).json({ message: "Tag successfully added!", tag });

    });
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
