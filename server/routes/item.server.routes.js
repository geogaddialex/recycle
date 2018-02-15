var items = require('../controllers/item.server.controller');
var Item = require( '../models/item.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', items.list );
router.get('/:id', items.getOne );

router.post('/', items.create );
router.delete('/:id', items.delete );

router.patch('/:id', items.update );
router.put('/:id', items.update );

module.exports = router;