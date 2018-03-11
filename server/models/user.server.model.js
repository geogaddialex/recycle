var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Location = require( './location.server.model' );


var userSchema = mongoose.Schema({

    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location'},

    local: {

    	  name: String,
        email: String,
        password: String

    },

    facebook: {

        id: String,
        token: String,
        name: String

    },

    google: {

        id : String,
        token: String,
        email: String,
        name: String
    },

    isAdmin: { type: Boolean, default: false },
    
    feedback: { 

        total: { type: Number, default: 0 }, 
        count: { type: Number, default: 0 },
        score: { type: Number, default: 100 }
    }

});


userSchema.methods.generateHash = function(password) {

    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);