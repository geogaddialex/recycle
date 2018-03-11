var locations = require('../controllers/location.server.controller');
// var Tag = require( '../models/tag.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', locations.list )

module.exports = router;