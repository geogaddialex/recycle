var mongoose = require('mongoose');
var User = require( './userModel' );
var Item = require( './itemModel' );

var exchangeSchema = mongoose.Schema({

	items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
	recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    accepted: { recipient:0, sender:0 } //if either party edits items list then other party's accepted resets to 0
});

module.exports = mongoose.model( 'Exchange', exchangeSchema );