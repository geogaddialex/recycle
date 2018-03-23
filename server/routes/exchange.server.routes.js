var users = require('../controllers/user.server.controller');
var exchanges = require('../controllers/exchange.server.controller');
var Exchange = require( '../models/exchange.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', exchanges.list );
router.post('/', exchanges.create );
router.get('/forUser/:id', users.lookupUser, exchanges.forUser );
router.get('/:id', exchanges.lookupExchange, function( req, res ){ res.json( req.exchange ); });
router.put('/:id', exchanges.update );


module.exports = router;