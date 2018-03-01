var mongoose = require('mongoose');
var User = require( './user.server.model' );

var notificationSchema = mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //this should be required
    message: { type: String },
    link: { type: String },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }

});

module.exports = mongoose.model( 'Notification', notificationSchema );