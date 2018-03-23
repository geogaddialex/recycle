var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var tagSchema = mongoose.Schema({

	name: { type: String, required: true, unique: true, uniqueCaseInsensitive: true, lowercase: true }
	
});

tagSchema.plugin( uniqueValidator );
module.exports = mongoose.model( 'Tag', tagSchema );