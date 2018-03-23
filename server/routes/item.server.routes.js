var items = require('../controllers/item.server.controller');
var users = require('../controllers/user.server.controller');
var groups = require('../controllers/group.server.controller');
var tags = require('../controllers/tag.server.controller');
var Item = require( '../models/item.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', items.list );
router.get('/search/:query', items.forSearch );
router.get('/user/:id', users.lookupUser, items.forUser );
router.get('/group/:id', groups.lookupGroup, items.forGroup );
router.get('/tag/:id', tags.lookupTag, items.forTag );

router.post('/', items.create );
router.get('/:id', items.getOne );
router.put('/:id', items.update );
router.delete('/:id', items.delete );


module.exports = router;