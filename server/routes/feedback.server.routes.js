var feedback = require('../controllers/feedback.server.controller');
var users = require('../controllers/user.server.controller');
var express = require('express');
var router = express.Router();

router.post('/', feedback.create );
router.get('/forUser/:id', users.lookupUser, feedback.forUser );

module.exports = router;