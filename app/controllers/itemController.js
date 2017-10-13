var Item = require( '../models/itemModel' );


exports.create = function( req, res ){

    var item = new Item({ name: req.body.name });
    console.log(req);

    item.save(function( err ){
        if( err ){
            return next( err );
        } else {
            res.render( 'message', {
                message: req.flash('msg', "Item added"),
                user: req.user
            });
        }
    });
};

exports.list = function( req, res ){
    Item.find({ }, function( err, items ){
           res.render( 'items', { items: items, user: req.user } );
    });
}