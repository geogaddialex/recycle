var item = require('../controllers/itemController');
var user = require('../controllers/userController');
var exchange = require('../controllers/exchangeController');

module.exports = function( app ){

	app.get('/exchange/:recipient/:item', loggedIn, function(req, res){
	    exchange.initiate( req, res );
	});
	
	app.get('/exchange/:recipient', loggedIn, function(req, res){
	    exchange.initiate( req, res );
	});

	app.get('/exchange', loggedIn, function(req, res){
	    res.render('message', {
            user: req.user,
            message: "Start an exchange page"
        });
	});
};


function loggedIn( req, res, next ) {
    if ( req.isAuthenticated() )
        return next( );
    res.render('login', { message: "Please log in to access this feature" });
}
