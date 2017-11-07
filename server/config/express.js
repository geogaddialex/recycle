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

	app.use( flash() );

	app.set( 'view engine', 'ejs' );
	app.set( 'views', path.join(__dirname, '../views') );

	require( '../routes/userRoutes.js' )( app );
	require( '../routes/itemRoutes.js' )( app );
	require( '../routes/exchangeRoutes.js' )( app );

	var routes = require ('../routes/loginRoutes.js');
	app.use('/api/', routes);

	app.use(function(req, res, next) {
  		res.sendFile( path.join(__dirname, '../../client/index.html') );
	})

	// error handlers
	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

	app.use(function(err, req, res) {
	  res.status(err.status || 500);
	  res.end(JSON.stringify({
	    message: err.message,
	    error: {}
	  }));
	});


module.exports = app;
