var mongoose = require('mongoose');
var User = require( './user.server.model' );

var feedbackSchema = mongoose.Schema({

	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	subject: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	comment: String,
	rating: Number,
	timestamp: { type: Date, default: Date.now }

}, 
{ collection: 'feedback' });

module.exports = mongoose.model( 'Feedback', feedbackSchema );