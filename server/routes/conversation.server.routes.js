var conversations = require('../controllers/conversation.server.controller');
var Conversation = require( '../models/conversation.server.model' );
var express = require('express');
var router = express.Router();

router.post('/', conversations.create );
router.get('/:id', conversations.lookupConversation, function( req, res ){ res.json( req.conversation ); });
router.put('/:id', conversations.update );

module.exports = router;