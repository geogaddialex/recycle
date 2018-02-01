var path 		          = require('path')					//not in use
var express  	        = require( 'express' )
var socketio 	        = require( 'socket.io' )
var http		          = require('http')
var logger            = require( 'morgan' )
var cookieParser      = require( 'cookie-parser' )
var bodyParser        = require( 'body-parser' )
var session           = require( 'express-session' )
var flash  		        = require( 'connect-flash' )				//not in use
var passport 	        = require( 'passport' )
var localStrategy     = require('passport-local' ).Strategy
var User 		          = require( '../models/userModel' )
                        require('datejs')

var app     	 = express( );

app.use( express.static( 'client' ) );

app.use( logger('dev') );
app.use( cookieParser() ); 
app.use( bodyParser.json() ); 
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( flash() );											//not in use


app.use( session({
    secret: 'badsecret',
    resave: false,
    saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );

passport.use( new localStrategy( User.authenticate() ) );
passport.serializeUser( User.serializeUser() );
passport.deserializeUser( User.deserializeUser() );


var loginRoutes = require( '../routes/loginRoutes.js' );
var itemRoutes = require( '../routes/itemRoutes.js' );
var userRoutes = require( '../routes/userRoutes.js' );
var exchangeRoutes = require( '../routes/exchangeRoutes.js' );
var messageRoutes = require( '../routes/messageRoutes.js' );
app.use('/api/login', loginRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/messages', messageRoutes);

// app.use('*', express.static('client'));
app.get('*', function(req, res) {
		res.sendFile( '/index.html', {root: './client'} );
})

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.send(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

// Attach Socket.io
var server = http.createServer( app );
var io = socketio.listen( server );
app.set( 'socketio', io );
app.set( 'server', server );

module.exports = app;
