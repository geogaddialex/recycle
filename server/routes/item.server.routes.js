var items = require('../controllers/item.server.controller');
var Item = require( '../models/item.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', items.list );
router.post('/', items.create );
router.get('/:id', items.lookupItem, function( req, res ){ res.json( req.item ); });
router.patch('/:id', items.update );
router.delete('/:id', items.delete );

module.exports = router;