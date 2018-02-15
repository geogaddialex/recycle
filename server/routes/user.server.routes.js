var User = require( '../models/user.server.model' );
var users = require('../controllers/user.server.controller');
var express = require('express');
var router = express.Router();

router.get('/', users.list );
router.get('/:id', users.lookupUser, function( req, res ){ res.json( req.user ); });
router.get('/byUsername/:username', users.lookupUserByUsername, function( req, res ){ res.json( req.user ); });
router.get('/:id/items', users.lookupUser, users.listItems );
router.get('/:id/exchanges', users.lookupUser, users.listExchanges );
router.get('/:id/feedback', users.lookupUser, users.listFeedback ); //is it necessary to lookup user when could just pass ID to controller??
router.patch('/:id', users.update );
router.delete('/:id', users.lookupUser, function( req, res ){ });

module.exports = router;