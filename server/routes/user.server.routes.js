var User = require( '../models/user.server.model' );
var users = require('../controllers/user.server.controller');
var express = require('express');
var router = express.Router();

router.get('/', users.list );
router.put('/:id', users.update );

router.get('/:id', users.lookupUser, function( req, res ){ res.json( req.user ); });

module.exports = router;