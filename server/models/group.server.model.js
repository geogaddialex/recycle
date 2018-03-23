var mongoose = require('mongoose');
var User = require( './user.server.model' );
var Conversation = require( './conversation.server.model' );

var groupSchema = mongoose.Schema({

	name: { type: String, required: true },
	members: 
			{ type: [{ 
				
				type: mongoose.Schema.Types.ObjectId, 
				ref: 'User' 

			}],validate: [arrayLimit, '{PATH} must have at least one entry']
	},

	conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
	created: { type: Date, default: Date.now }
	
});

function arrayLimit( members ){
  return members.length >= 1;
}

module.exports = mongoose.model( 'Group', groupSchema );