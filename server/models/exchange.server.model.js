var mongoose = require('mongoose');
var User = require( './user.server.model' );
var Item = require( './item.server.model' );
var Message = require( './conversation.server.model' );
var Feedback = require( './feedback.server.model' );

var exchangeSchema = mongoose.Schema({

	recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	created: { type: Date, default: Date.now },
	lastModified: { type: Date, default: Date.now },

	items: { 
		sender: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
		recipient: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
	},
	
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },

    accepted: { recipient:0, sender:0 },
    status: {type: String, default: 'In progress'},

    feedback:  { 
		sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
		recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }
	}
}, 
{ minimize: false });

module.exports = mongoose.model( 'Exchange', exchangeSchema );