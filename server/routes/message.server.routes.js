var messages = require('../controllers/message.server.controller');
var Message = require( '../models/message.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', messages.list );
router.post('/', messages.create );
router.get('/:id', messages.lookupMessage, function( req, res ){ res.json( req.message ); });
router.patch('/:id', messages.update );
router.delete('/:id', messages.delete );

module.exports = router;