module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index', {
            user: req.user
        });
    });

    app.get('/profile', loggedIn, function(req, res) {
        res.render('profile', {
            user: req.user
        });
    });



    app.get('/login', alreadyLoggedIn, function(req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));



    app.get('/register', alreadyLoggedIn, function(req, res) {
        res.render('register', { message: req.flash('signupMessage') });
    });

    app.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }));



    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};


function loggedIn( req, res, next ) {
    if ( req.isAuthenticated() )
        return next( );
    res.redirect( '/' );
}

function alreadyLoggedIn( req, res, next ) {
    if ( req.isAuthenticated() ){
        res.redirect( '/' );

    } else {
        return next( );

    }
}