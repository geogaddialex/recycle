var mongoose = require('mongoose');
var User = require( './user.server.model' );
var Message = require( './message.server.model' );

var conversationSchema = mongoose.Schema({

	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
	initiated: { type: Date, default: Date.now }
	
});

module.exports = mongoose.model( 'Conversation', conversationSchema );