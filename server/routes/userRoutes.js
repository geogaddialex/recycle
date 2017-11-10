var users = require('../controllers/userController');
var express = require('express');
var router = express.Router();


	router.get('/users', users.list );

	// router.get('/users/:name', users.getUser( id ) );

module.exports = router;