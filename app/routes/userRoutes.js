var item = require('../controllers/itemController');
var user = require('../controllers/userController');

module.exports = function(app, passport){

    app.get('/', loggedIn, function(req, res){
        res.render('index', {
            user: req.user,
            message: req.flash('msg')
        });
    });

    app.get('/login', alreadyLoggedIn, function(req, res){
        res.render('login', { message: req.flash('msg') });
    });

    app.post('/login', passport.authenticate('login',{
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/profile', loggedIn, function(req, res){
        user.showProfile( req, res );
    });

    app.post('/register', passport.authenticate('signup',{
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/logout', loggedIn, function(req, res){
        req.logout();
        res.redirect('/login');
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
    res.render('login', { message: "Please log in for full access" });   //dont show message if going to root
}

function alreadyLoggedIn( req, res, next ) {
    if ( req.isAuthenticated() ){
        res.redirect( '/' );
    } else {
        return next( );
    }
}