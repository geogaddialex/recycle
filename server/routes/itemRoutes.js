var item = require('../controllers/itemController');
var user = require('../controllers/userController');

module.exports = function( app ){

    app.get('/items', function( req, res ){
        item.list( req, res );
    });

    app.post('/addItem', function( req, res ){
    	item.create( req, res );
    });

    app.get('/items/:id', function(req, res){
        item.displayOne( req, res );
    });

};