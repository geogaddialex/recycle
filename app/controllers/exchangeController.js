var items = require('./itemController');
var users = require('./userController');
var async = require('async');

exports.initiate = function( req, res ){
    users.findUserByName( req.params.recipient, function( recipient ){

    	async.parallel({
		    sender: function( callback ){

		        items.findItemsBelongingTo( req.user, function( sendersItems ){
		            callback(null, { items: sendersItems });
		        });
		    },
		    recipient: function( callback ){

		        items.findItemsBelongingTo( recipient, function( recipientsItems ){
		            callback(null, { items: recipientsItems });
		        });
		    }
		}, function(err, results) {

			    res.render('exchange', {
		            item: req.params.item,
		            user: req.user,
		            userItems: results.sender.items,
		            recipient: recipient,
		            recipientItems: results.recipient.items,
		            message: req.flash('msg')
		        });
			});

    	

    });
}