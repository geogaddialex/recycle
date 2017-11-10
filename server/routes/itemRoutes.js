var items = require('../controllers/itemController');
var Item = require( '../models/itemModel' );
var express = require('express');
var router = express.Router();

router.get('/', items.list );
router.post('/', items.create );
router.get('/:id', lookupItem, function( req, res ){ res.json( req.item ); });
router.patch('/:id', lookupItem, function( req, res ){ });
router.delete('/:id', lookupItem, function( req, res ){ });

function lookupItem(req, res, next) {

  	var id = req.params.id;

  	Item.findOne({ '_id': id }).populate({ path: 'owner' }).exec( function( err, item ){
        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve item" });
        }

        if( !item ){
            console.log( "No item found" );
            return res.status(404).json({ errors: "No such item" });
        } 
        
        req.item = item;
        next();
    });
  
}

module.exports = router;