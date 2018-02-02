var mongoose = require('mongoose');
var User = require( './userModel' );

var messageSchema = mongoose.Schema({

	recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	content: String,
	timestamp: { type: Date, default: Date.now }

});

module.exports = mongoose.model( 'Message', messageSchema );