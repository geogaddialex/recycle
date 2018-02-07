var mongoose = require('mongoose');
var User = require( './user.server.model' );

var itemSchema = mongoose.Schema({
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
});

module.exports = mongoose.model( 'Item', itemSchema );