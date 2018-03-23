var mongoose = require('mongoose');
var User = require( './user.server.model' );

var notificationSchema = mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    message: { type: String, required:  true },
    link: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }

});

module.exports = mongoose.model( 'Notification', notificationSchema );