var User = require( '../models/userModel' );
var Item = require( '../models/itemModel' );
var Exchange = require( '../models/exchangeModel' );
var items = require('./itemController');
var users = require('./userController');
var async = require('async');

exports.list = function( req, res ){

    User.find({ }, function( err, users ){

    users = Object.values(users);

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ users: users });
            
    })
}


exports.create = function( ){
    
}

exports.listItems = function( req, res ){

    var user = req.user;

    Item.find({owner: user}).populate({ path: 'owner' }).exec( function( err, items ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ items: items });
            
    })
}

exports.listExchanges = function( req, res ){

    var user = req.user;

    Exchange.find({$or:[{recipient: user},{sender: user}]}).populate({ path: 'sender' }).exec( function( err, exchanges ){

        if( err ){
            console.log( "error: " + err );
            return res.status( 500 );
        }
        
        res.json({ exchanges: exchanges });
            
    })
}

exports.findUserByID = function( id, callback ){

    User.findOne({ '_id':  id }, function( err, user ){
        if( err ){  
            console.log( err ); 
            callback( null );
        }

        if( !user ){
            callback( null );
    
        } else {
            callback( user );
        }
    });
}

exports.showProfile = function( req, res ){

	//find all items for req.user

    Item.find({ }, function( err, items ){
        newItems = [];
        async.each( items, ofUser, whenDone );
            
    });

    function ofUser( item, callback ){
        items.findItemByID( item, function( item ){

        		if( item.owner.toString().trim() === req.user._id.toString().trim() ){
        			
        			newItems.push({ name: item.name });
        		}
                callback();
        }); 
    }

    function whenDone( err ){
        if( err ){
            console.log( "error: " + err );
        } else {
            res.render('profile', {
		        user: req.user,
		        items: newItems
		    });
        }        
    }
}

exports.goToUser = function( req, res ){
    users.findUserByName( req.params.user, function( userToView ){

        items.findItemsBelongingTo( userToView, function( items ){
            res.render('user', {
                user: req.user,
                userToView: userToView,
                items: items
            });
        })

    });
}

exports.showMyItems = function( req, res ){
    items.findItemsBelongingTo( req.user, function( items ){
        res.render('myItems', {
            user: req.user,
            items: items
        });
    })

}

exports.validEmail = function( email ){
	var match = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    
	return match.test( email );
};