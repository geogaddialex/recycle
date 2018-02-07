var conversations = require('../controllers/conversation.server.controller');
var Conversation = require( '../models/conversation.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', conversations.list );
router.post('/', conversations.create );
router.get('/:id', conversations.lookupConversation, function( req, res ){ res.json( req.conversation ); });
router.patch('/:id', conversations.update );
router.delete('/:id', conversations.delete );

module.exports = router;