var mongoose = require('mongoose');
var User = require( './userModel' );
var Item = require( './itemModel' );

var Message = require( './messageModel' );
// var Feedback = require( './feedbackModel' );

var exchangeSchema = mongoose.Schema({

	recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

	items: { 
		sender: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
		recipient: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
	},
	
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],

    //if either party edits items list then other party's accepted resets to 0, when user presses send theirs is 1
    accepted: { recipient:0, sender:0 },
    
    feedback:  { 
		// sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
		// recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }
	}
});

module.exports = mongoose.model( 'Exchange', exchangeSchema );