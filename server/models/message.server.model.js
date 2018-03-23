var mongoose = require('mongoose');
var User = require( './user.server.model' );

var messageSchema = mongoose.Schema({

	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true },
	timestamp: { type: Date, default: Date.now }

});

module.exports = mongoose.model( 'Message', messageSchema );