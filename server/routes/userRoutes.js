var User = require( '../models/userModel' );
var users = require('../controllers/userController');
var express = require('express');
var router = express.Router();

router.get('/', users.list );
router.post('/', users.create );
router.get('/:id', lookupUser, function( req, res ){ res.json( req.user ); });
router.get('/:id/items', lookupUser, function( req, res ){ users.listItems });
router.patch('/:id', lookupUser, function( req, res ){ });
router.delete('/:id', lookupUser, function( req, res ){ });


function lookupUser(req, res, next) {

  	var id = req.params.id;

  	console.log( "lookupUser userId = " + id );

  	User.findOne({ '_id': id }, function( err, user ){
        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve user" });
        }

        if( !user ){
            console.log( "No user found" );
            return res.status(404).json({ errors: "No such user" });
        } 
        
        req.user = user;
        next();
    });
  
}

module.exports = router;