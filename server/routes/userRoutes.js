var item = require('../controllers/itemController');
var user = require('../controllers/userController');

module.exports = function( app ){

    app.get('/profile', function(req, res){
        user.showProfile( req, res );
    });

    app.get('/users/:user', function(req, res){
        user.goToUser( req, res );
    });

    app.get('/myItems', function(req, res){
        user.showMyItems( req, res );
    });

};