var mongoose = require('mongoose');
var Item = require( './itemModel' );
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
	    username: String,
	    password: String,
        email: String,
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

userSchema.plugin( passportLocalMongoose );

module.exports = mongoose.model('User', userSchema);
