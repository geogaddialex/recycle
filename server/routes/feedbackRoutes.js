var feedback = require('../controllers/feedbackController');
var Feedback = require( '../models/feedbackModel' );
var express = require('express');
var router = express.Router();

router.get('/', feedback.list );
router.post('/', feedback.create );
router.get('/:id', feedback.lookupFeedback, function( req, res ){ res.json( req.feedback ); });
router.patch('/:id', feedback.update );
router.delete('/:id', feedback.delete );

module.exports = router;