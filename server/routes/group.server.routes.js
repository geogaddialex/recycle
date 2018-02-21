var groups = require('../controllers/group.server.controller');
var express = require('express');
var router = express.Router();

router.get('/', groups.list );
router.get('/:id', groups.getOne );

router.post('/', groups.create );
router.delete('/:id', groups.delete );

router.patch('/:id', groups.update );
router.put('/:id', groups.update );

router.get('/:id/items', groups.lookupGroup, groups.getItems );


module.exports = router;