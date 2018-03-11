// var images = require('../controllers/image.server.controller');
// var Image = require( '../models/image.server.model' );
var express = require('express');
var router = express.Router();
var multer = require('multer')

var storage = multer.diskStorage({

  destination: function( req, file, callback ){

    callback(null, 'client/images/uploads/');

  },
  filename: function(req, file, callback){

    var filename = Date.now();

    switch( file.mimetype ){

      case 'image/png':
      	filename = filename + ".png";
      	break;
      case 'image/jpeg':
      	filename = filename + ".jpeg";
      	break;
      default:
      	break;
    }

    callback(null, filename);
  }
});

var upload = multer({ storage: storage}).single('image');

// var upload = multer({

//   dest: 'client/images/uploads/',
//   limits: { fileSize: 1000000 },

// }).single('image')

// router.get('/', images.list );
// router.get('/:id', images.getOne );
// router.delete('/:id', images.delete );

router.post('/', function(req, res, next) {

    upload(req, res, function (err) {

        if (err) {

          console.log(err);
          return res.status(422)

        }  

        console.log( JSON.stringify( req.file, null,2 ) )

        res.status(200).json( req.file ); 
  	});     

});

module.exports = router;