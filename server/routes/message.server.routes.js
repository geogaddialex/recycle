var messages = require('../controllers/message.server.controller');
var Message = require( '../models/message.server.model' );
var express = require('express');
var router = express.Router();

router.post('/', messages.create );

module.exports = router;