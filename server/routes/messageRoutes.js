var messages = require('../controllers/messageController');
var Message = require( '../models/messageModel' );
var express = require('express');
var router = express.Router();

router.get('/', messages.list );
router.post('/', messages.create );
router.get('/:id', messages.lookupMessage, function( req, res ){ res.json( req.message ); });
router.patch('/:id', messages.update );
router.delete('/:id', messages.delete );

module.exports = router;