var notification = require('../controllers/notification.server.controller');
var Notification = require( '../models/notification.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', notification.list );
router.post('/', notification.create );
router.patch('/:id', notification.update );
router.delete('/:id', notification.delete );

module.exports = router;