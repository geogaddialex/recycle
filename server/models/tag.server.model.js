var mongoose = require('mongoose');

var tagSchema = mongoose.Schema({

	name: { type: String }
	
});

module.exports = mongoose.model( 'Tag', tagSchema );