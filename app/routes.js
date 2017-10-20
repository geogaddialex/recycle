var item = require('../app/controllers/itemController');
var user = require('../app/controllers/userController');

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

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    // app.use(function(req, res, next){
    //     res.render('404', {
    //         user: req.user,
    //         message: req.flash('msg')
    //     });
    // });

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