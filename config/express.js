module.exports = function( passport ){

	var express  	 = require( 'express' );
	var app     	 = express( );

	var morgan       = require( 'morgan' );
	var cookieParser = require( 'cookie-parser' );
	var bodyParser   = require( 'body-parser' );
	var session      = require( 'express-session' );
	var flash  		 = require( 'connect-flash' );

	app.use( express.static( './public' ));

	app.use( morgan('dev') ); // console logger
	app.use( cookieParser() ); 
	app.use( bodyParser.json() ); 
	app.use( bodyParser.urlencoded({ extended: true }) );

	app.use( session({
	    secret: 'badsecret',
	    resave: true,
	    saveUninitialized: true
	}) );

	app.use( passport.initialize() );
	app.use( passport.session() );
	app.use( flash() );

	app.set( 'view engine', 'ejs' );
	app.set( 'views', './app/views' );

	require( '../app/routes/userRoutes.js' )( app, passport );
	require( '../app/routes/itemRoutes.js' )( app );
	require( '../app/routes/exchangeRoutes.js' )( app );

	app.use(function(req, res, next){
        res.render('404', {
        	intended: req.url.replace( /\// , "" ),
            user: req.user,
            message: req.flash('msg')
        });
    });

	return app;
}