var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Location = require( './location.server.model' );


var userSchema = mongoose.Schema({

    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
    maxDistance: { type: Number, default: 50, min: 1 },

    local: {

    	name: { type: String, validate: /^[0-9a-zA-Z\- \/_£?:.,\s]*$/, minlength: 1, maxlength: 70 },
        email: { type: String, validate: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
        password: { type: String }

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
        score: { type: Number, default: 100, max:100 }
    }

});

userSchema.pre('validate', function( next ){

  if( !(this.local || this.facebook || this.google) ){
    
    this.invalidate('local', 'User must have at least one of local, facebook or google login details', this.local);  

  }else if( this.local && !this.local.name ){

    this.invalidate('local', 'When registering, the user must have a name', this.local )

  }else if( this.local && !this.local.email ){

    this.invalidate('local', 'When registering, the user must have a name', this.local )

  }else if( this.local && !this.local.password ){

    this.invalidate('local', 'When registering, the user must have a password', this.local )

  }else if( this.local && !this.location ){

    this.invalidate('location', 'When registering locally, a location must be provided', this.location )

  }

    next();

});


userSchema.methods.generateHash = function(password) {

    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);