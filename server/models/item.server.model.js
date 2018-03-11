var mongoose = require('mongoose');
var User = require( './user.server.model' );

var itemSchema = mongoose.Schema({
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //this should be required
    name: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, default: "" },
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}]
});

module.exports = mongoose.model( 'Item', itemSchema );