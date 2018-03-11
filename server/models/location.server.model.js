var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({

	name: { type: String },
	country: { type: String },
	lat: { type: Number },
	long: { type: Number }
	
});

module.exports = mongoose.model( 'Location', locationSchema );