var tags = require('../controllers/tag.server.controller');
var Tag = require( '../models/tag.server.model' );
var express = require('express');
var router = express.Router();

router.post('/', tags.create );
router.get('/', tags.list );
router.get('/:tag', tags.lookupTag, function( req, res ){ res.json( req.tag ) });
router.get('/:tag/items', tags.lookupTag, tags.getItems );


module.exports = router;