var mongoose = require('mongoose');
var User = require( './user.server.model' );

var itemSchema = mongoose.Schema({
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
    image: { type: String },
    removed: { type: Boolean, default: false }
});

module.exports = mongoose.model( 'Item', itemSchema );