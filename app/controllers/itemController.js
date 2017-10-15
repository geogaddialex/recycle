var Item = require( '../models/itemModel' );
var User = require( '../models/userModel' );
var users = require('./userController');


exports.create = function( req, res ){

    if( req.user ){
        var item = new Item({ name: req.body.name, owner: req.user });

        item.save(function( err ){
            if( err ){
                console.log("error: " + err);
                return err;
            } else {

                User.findByIdAndUpdate(
                    req.user,               //id
                    {$push: {items: item}},
                    {safe: true, upsert: true},
                    function( err, model ){
                        if( err ){
                            console.log( "error adding item to user: " + err );
                        } else {
                            //return 1 - implement when moving this method to new function
                        }
                    }
                );

                req.flash('msg', "Item added");
                res.render( 'message', {
                    message: req.flash('msg'),
                    user: req.user
                });
            }
        });
    } else {
        req.flash('msg', "No user detected, item not added");

        res.render( 'addItem', {
            message: req.flash('msg'),
            user: req.user
        });
    }
};

exports.addToUser = function(  ){
    console.log();

}

exports.list = function( req, res ){
    Item.find({ }, function( err, items ){
           res.render( 'items', { items: items, user: req.user } );
    });
}