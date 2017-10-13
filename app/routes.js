var item = require('../app/controllers/itemController');

module.exports = function(app, passport){

    app.get('/', loggedIn, function(req, res){
        res.render('index', {
            user: req.user
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
        res.render('profile', {
            user: req.user
        });
    });

    app.get('/register', alreadyLoggedIn, function(req, res){
        res.render('register', { message: req.flash('msg') });
    });

    app.post('/register', passport.authenticate('signup',{
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }));

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('/addItem', loggedIn, function(req, res){
        res.render('addItem', {
            user: req.user
        });
    });

};

function loggedIn( req, res, next ) {
    if ( req.isAuthenticated() )
        return next( );
    res.redirect( '/login' );
}

function alreadyLoggedIn( req, res, next ) {
    if ( req.isAuthenticated() ){
        res.redirect( '/' );
    } else {
        return next( );
    }
}