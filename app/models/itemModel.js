var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var User = require( './userModel' );

var itemSchema = mongoose.Schema({
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
});

module.exports = mongoose.model( 'Item', itemSchema );