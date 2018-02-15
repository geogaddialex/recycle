var mongoose = require('mongoose');
var User = require( './user.server.model' );

var itemSchema = mongoose.Schema({
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //this should be required
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },    
});

module.exports = mongoose.model( 'Item', itemSchema );