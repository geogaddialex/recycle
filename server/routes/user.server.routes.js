var User = require( '../models/user.server.model' );
var users = require('../controllers/user.server.controller');
var express = require('express');
var router = express.Router();

router.get('/', users.list );
router.patch('/:id', users.update );
router.put('/:id', users.update );

router.get('/byEmail/:email', users.lookupUserByEmail, function( req, res ){ res.json( req.user ); });
router.get('/:id', users.lookupUser, function( req, res ){ res.json( req.user ); });
router.get('/:id/items', users.lookupUser, users.listItems );
router.get('/:id/exchanges', users.lookupUser, users.listExchanges );
router.get('/:id/feedback', users.lookupUser, users.listFeedback );
router.get('/:id/groups', users.lookupUser, users.listGroups );


module.exports = router;