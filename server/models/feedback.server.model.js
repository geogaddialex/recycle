var mongoose = require('mongoose');
var User = require( './user.server.model' );

var feedbackSchema = mongoose.Schema({

	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	subject: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	comment: { type: String, required: true, validate: /^[0-9a-zA-Z\- \/_£?:.,\s]*$/ },
	rating: { type: Number, required: true },
	timestamp: { type: Date, default: Date.now },
	exchangeHappened: { type: Boolean, required: true }
}, 
{ collection: 'feedback' });

module.exports = mongoose.model( 'Feedback', feedbackSchema );