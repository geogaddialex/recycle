var feedback = require('../controllers/feedback.server.controller');
var Feedback = require( '../models/feedback.server.model' );
var express = require('express');
var router = express.Router();

router.get('/', feedback.list );
router.post('/', feedback.create );
router.get('/:id', feedback.lookupFeedback, function( req, res ){ res.json( req.feedback ); });
router.patch('/:id', feedback.update );
router.delete('/:id', feedback.delete );

module.exports = router;