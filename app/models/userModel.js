var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Item = require( './itemModel' );

var userSchema = mongoose.Schema({
	    username: String,
        email: String,
        password: String,
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.correctPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);
