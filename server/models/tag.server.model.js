var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var tagSchema = mongoose.Schema({

	name: { type: String,
			required: true,
			unique: true,
			uniqueCaseInsensitive: true,
			lowercase: true,
			minlength: 3,
			maxlength: 15,
			validate: /^[0-9a-zA-Z\- \/_£?:.,\s]*$/
	}
	
});

tagSchema.plugin( uniqueValidator );
module.exports = mongoose.model( 'Tag', tagSchema );