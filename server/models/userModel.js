var mongoose = require('mongoose');
var Item = require( './itemModel' );
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
	    username: String,
	    password: String,
        email: String,
       	isAdmin: { type: Boolean, default: false },
       	feedback: { 
   			total: { type: Number, default: 0 }, 
   			count: { type: Number, default: 0 },
   			score: { type: Number, default: 100 }
       	}
});

userSchema.plugin( passportLocalMongoose );

module.exports = mongoose.model('User', userSchema);