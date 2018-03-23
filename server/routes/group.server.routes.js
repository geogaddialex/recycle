var groups = require('../controllers/group.server.controller');
var users = require('../controllers/user.server.controller');
var express = require('express');
var router = express.Router();

router.get('/', groups.list );
router.post('/', groups.create );
router.put('/:id', groups.update );

router.get('/forUser/:id', users.lookupUser, groups.forUser );

router.get('/:id', groups.lookupGroup, function( req, res ){ res.json( req.group ); });
router.get('/:id/items', groups.lookupGroup, groups.getItems );


module.exports = router;