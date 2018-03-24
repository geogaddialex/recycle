var mongoose = require('mongoose');
var User = require( './user.server.model' );

var messageSchema = mongoose.Schema({

	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true, validate: /^[0-9a-zA-Z\- \/_£?:.,\s]*$/ },
	timestamp: { type: Date, default: Date.now }

});

module.exports = mongoose.model( 'Message', messageSchema );