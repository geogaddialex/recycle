var item = require('../controllers/itemController');
var user = require('../controllers/userController');

module.exports = function( app ){

    app.get('/items', loggedIn, function( req, res ){
        item.list( req, res );
    });

    app.get('/addItem', loggedIn, function(req, res){
	    res.render('addItem', {
	        user: req.user,
	        message: req.flash('msg')
	    });
    });

    app.post('/addItem', function( req, res ){
    	item.create( req, res );
    });

    app.get('/items/:id', loggedIn, function(req, res){
        item.displayOne( req, res );
    });

};

function loggedIn( req, res, next ) {
    if ( req.isAuthenticated() )
        return next( );
    res.redirect( '/login' );
}