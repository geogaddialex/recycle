// var images = require('../controllers/image.server.controller');
// var Image = require( '../models/image.server.model' );
var express = require('express');
var router = express.Router();
var multer = require('multer')

var upload = multer({

  dest: __dirname='client/images/uploads/',
  limits: { fileSize: 1000000 },

}).single('image')

// router.get('/', images.list );
// router.get('/:id', images.getOne );
// router.delete('/:id', images.delete );

router.post('/', function(req, res, next) {

	var path = '';
    upload(req, res, function (err) {

        if (err) {

          console.log(err);
          return res.status(422)

        }  

        path = req.file.path;
        return res.status(200).send( JSON.stringify( req.file,null,2) ); 
  	});     

});

module.exports = router;