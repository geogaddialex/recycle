var item = require('../controllers/itemController');
var user = require('../controllers/userController');

module.exports = function(app, passport){

    app.get('/profile', loggedIn, function(req, res){
        user.showProfile( req, res );
    });

    app.get('/users/:user', loggedIn, function(req, res){
        user.goToUser( req, res );
    });

    app.get('/myItems', loggedIn, function(req, res){
        user.showMyItems( req, res );
    });

};

function loggedIn( req, res, next ) {
    if ( req.isAuthenticated() )
        return next( );
    console.log( "not authenticated" );
}