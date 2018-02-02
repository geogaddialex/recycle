var mongoose = require('mongoose');
var User = require( './userModel' );
var Item = require( './itemModel' );

var Message = require( './messageModel' );
// var Feedback = require( './feedbackModel' );

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
	
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],

    accepted: { recipient:0, sender:0 },
    status: {type: String, default: 'In progress'},

    feedback:  { 
		sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
		recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }
	}
}, 
{ minimize: false });

module.exports = mongoose.model( 'Exchange', exchangeSchema );