var mongoose = require('mongoose');
var User = require( './user.server.model' );
var Conversation = require( './conversation.server.model' );

var groupSchema = mongoose.Schema({

	name: String,
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
	created: { type: Date, default: Date.now }
	
});

module.exports = mongoose.model( 'Group', groupSchema );