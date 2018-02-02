var mongoose = require('mongoose');
var User = require( './userModel' );

var feedbackSchema = mongoose.Schema({

	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	comment: String,
	rating: Number,
	timestamp: { type: Date, default: Date.now }

});

module.exports = mongoose.model( 'Feedback', feedbackSchema );