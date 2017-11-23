var exchange = require('../controllers/exchangeController');
var Item = require( '../models/exchangeModel' );
var express = require('express');
var router = express.Router();

router.get('/', exchange.list );
router.post('/', exchange.create );
router.get('/:id', lookupExchange, function( req, res ){ res.json( req.exchange ); });
router.patch('/:id', lookupExchange, function( req, res ){ });
router.delete('/:id', lookupExchange, function( req, res ){ });

function lookupExchange(req, res, next) {

  	var id = req.params.id;

  	Exchange.findOne({ '_id': id }, function( err, exchange ){
        if( err ){  
            console.log( err ); 
            return res.status(500).json({ errors: "Could not retrieve exchange" });
        }

        if( !exchange ){
            console.log( "No exchange found" );
            return res.status(404).json({ errors: "No such exchange" });
        } 
        
        req.exchange = exchange;
        next();
    });
  
}

module.exports = router;