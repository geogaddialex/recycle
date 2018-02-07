var mongoose = require('mongoose');
var User = require( './user.server.model' );

var messageSchema = mongoose.Schema({

	// recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, unnecessary because the conversation stores users involved
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	content: String,
	timestamp: { type: Date, default: Date.now }

});

module.exports = mongoose.model( 'Message', messageSchema );