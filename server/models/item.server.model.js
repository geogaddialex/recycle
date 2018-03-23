var mongoose = require('mongoose');
var User = require( './user.server.model' );

var itemSchema = mongoose.Schema({
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 30 },
    condition: { type: String, required: true, enum: ['New', 'Used'] },
    description: { type: String, default: "", maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
    image: { type: String },
    removed: { type: Boolean, default: false }
});

module.exports = mongoose.model( 'Item', itemSchema );