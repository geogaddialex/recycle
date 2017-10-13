var item = require('../controllers/itemController');

module.exports = function( app ){

    app.post('/addItem', function( req, res ){
    	item.create( req, res );
    });

    app.get('/items', function( req, res ){
        item.list( req, res );
    });
};