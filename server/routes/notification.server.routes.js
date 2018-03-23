var notification = require('../controllers/notification.server.controller');
var Notification = require( '../models/notification.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', notification.list );
router.post('/', notification.create );
router.put('/:id', notification.update );

module.exports = router;