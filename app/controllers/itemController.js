var Item = require( '../models/itemModel' );
var User = require( '../models/userModel' );
var users = require('./userController');
var async = require('async');

exports.findItemByID = function( id, callback ){

    Item.findOne({ '_id':  id }, function( err, item ){
        if( err ){  
            console.log( err ); 
            callback( null );
        }

        if( !item ){
            console.log( "no item" );
            callback( null );
    
        } else {
            callback( item );
        }
    });
}

exports.create = function( req, res ){

    if( req.user ){
        var item = new Item({ name: req.body.name, owner: req.user });

        item.save(function( err ){
            if( err ){
                console.log("error: " + err);
                return err;

            } else {

                exports.addToUser( req.user, item, function( success ){

                    if( success ){
                        req.flash( 'msg', "Item added: " + item.name );
                        res.render( 'message', {
                            message: req.flash( 'msg' ),
                            user: req.user
                        });
                    } else {
                        console.log( "un" )
                    }
                    
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

exports.addToUser = function( user, item, callback ){

    User.findByIdAndUpdate(
        user,               //id
        {$push: {items: item}},
        {safe: true, upsert: true},
        function( err, model ){
            if( err ){
                console.log( "error adding item to user: " + err );
            } else {
                callback( 1 );
            }
        }
    );
}

exports.findOwnerOfItem = function( id, callback ){
    exports.findItemByID( id, function( item ){
        users.findUserByID( item.owner, function( user ){
            callback();
        } )
    });
}


exports.list = function( req, res ){

    Item.find({ }, function( err, items ){
        newItems = [];
        async.each( items, findUser, whenDone );
            
    });

    function findUser( item, callback ){
        users.findUserByID( item.owner, function( user ){
                newItems.push({ id:item._id, name: item.name, owner: user.username });
                callback();
        }); 
    }

    function whenDone( err ){
        if( err ){
            console.log( "error: " + err );
        } else {
            res.render( 'items', { items: newItems, user: req.user } ); 
        }        
    }
}


exports.displayOne = function( req, res ){

    exports.findItemByID( req.params.id, function( item ){

        users.findUserByID( item.owner, function( user ){

            var itemToDisplay = { id: req.params.id, name: item.name, owner: user.username }

            res.render('item', {
                item: itemToDisplay,
                user: req.user,
                message: req.flash('msg')
            });

        }); 
    });

}

exports.findItemsBelongingTo = function( user, callback ){

    var userToTest = user;
    var newItems = [];

    Item.find({ }, function( err, items ){

        async.each( items, ofUser, whenDone );    
    });

    function ofUser( item, callback ){
        exports.findItemByID( item, function( item ){

            if( item.owner.toString().trim() === userToTest.id.toString().trim() ){
                newItems.push({ id:item._id, name: item.name, owner: userToTest.username });
            }
            callback();
        }); 
    }

    function whenDone( err ){
        if( err ){
            console.log( "error: " + err );
        } else {
            callback( newItems ); 
        }        
    }
}