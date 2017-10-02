module.exports = function( passport ){

	var express  	 = require( 'express' );
	var app     	 = express( );

	var morgan       = require( 'morgan' );
	var cookieParser = require( 'cookie-parser' );
	var bodyParser   = require( 'body-parser' );
	var session      = require( 'express-session' );
	var flash  		 = require( 'connect-flash' );

	app.use( express.static('./public') );

	app.use( morgan('dev') ); // log every request to the console
	app.use( cookieParser() ); // read cookies (needed for auth)
	app.use( bodyParser.json() ); // get information from html forms
	app.use( bodyParser.urlencoded({ extended: true }) );

	app.use( session({
	    secret: 'badsecret',
	    resave: true,
	    saveUninitialized: true
	}) );
	app.use( passport.initialize() );
	app.use( passport.session() );
	app.use( flash() );

	app.set( 'view engine', 'ejs' ); // set up ejs for templating
	app.set( 'views', './views' );

	require( '../app/routes.js' )( app, passport ); // load routes, pass in app and fully configured passport

	return app;
}