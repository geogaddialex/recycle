var items = require('../controllers/item.server.controller');
var users = require('../controllers/user.server.controller');
var Item = require( '../models/item.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', items.list );
router.get('/search/:query', items.getItemsMatchingSearch );
router.get('/forUser/:id', users.lookupUser, items.forUser );

router.post('/', items.create );
router.get('/:id', items.getOne );
router.put('/:id', items.update );
router.delete('/:id', items.delete );


module.exports = router;