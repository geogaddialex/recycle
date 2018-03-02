var tags = require('../controllers/tag.server.controller');
var Tag = require( '../models/tag.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', tags.list );
router.post('/', tags.create );
router.delete('/:id', tags.delete );
router.get('/:tag/items', tags.lookupTag, tags.getItems );


module.exports = router;