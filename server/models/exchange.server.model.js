var mongoose = require('mongoose');
var User = require( './user.server.model' );
var Item = require( './item.server.model' );
var Message = require( './conversation.server.model' );
var Feedback = require( './feedback.server.model' );

var exchangeSchema = mongoose.Schema({

	recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	created: { type: Date, default: Date.now },
	lastModified: { type: Date, default: Date.now },

	items: { 
		sender: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
		recipient: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
	},
	
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },

    accepted: { 
    	recipient: { type: Number, default: 0 },
    	sender: { type: Number, default: 1 }
    },
    status: {type: String, enum: ['In progress', 'Completed', 'Cancelled'], required: true},

    feedback:  { 
		sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
		recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }
	}
}, 
{ minimize: false });


exchangeSchema.pre('validate', function( next ){

  if( !this.items || ( this.items.sender.length < 1 && this.items.recipient.length < 1 ) ){
    
    	this.invalidate('items', 'There must be at least one item to create an exchange', this.items)
  }

  next();

});

module.exports = mongoose.model( 'Exchange', exchangeSchema );