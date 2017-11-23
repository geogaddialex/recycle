	var path 		 = require('path');
	var express  	 = require( 'express' );
	var logger       = require( 'morgan' );
	var cookieParser = require( 'cookie-parser' );
	var bodyParser   = require( 'body-parser' );
	var session      = require( 'express-session' );
	var flash  		 = require( 'connect-flash' );
	var passport 	 = require( 'passport' );
	var localStrategy = require('passport-local' ).Strategy;
	var User 		 = require( '../models/userModel' );	

	var app     	 = express( );

	app.use( express.static( 'client' ) );

	app.use( logger('dev') );
	app.use( cookieParser() ); 
	app.use( bodyParser.json() ); 
	app.use( bodyParser.urlencoded({ extended: false }) );
	app.use( flash() );


	app.use( session({
	    secret: 'badsecret',
	    resave: false,
	    saveUninitialized: false
	}) );

	app.use( passport.initialize() );
	app.use( passport.session() );

	passport.use( new localStrategy( User.authenticate() ) );
	passport.serializeUser( User.serializeUser() );
	passport.deserializeUser( User.deserializeUser() );


	var loginRoutes = require( '../routes/loginRoutes.js' );
	var itemRoutes = require( '../routes/itemRoutes.js' );
	var userRoutes = require( '../routes/userRoutes.js' );
	app.use('/api/login', loginRoutes);
	app.use('/api/items', itemRoutes);
	app.use('/api/users', userRoutes);

	app.use(function(err, req, res) {
	  res.send('/');
	});

module.exports = app;
