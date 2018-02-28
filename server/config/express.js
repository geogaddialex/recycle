var path 		          = require( 'path' )
var express  	        = require( 'express' )
var socketio 	        = require( 'socket.io' )
var http		          = require( 'http' )
var logger            = require( 'morgan' )
var cookieParser      = require( 'cookie-parser' )
var bodyParser        = require( 'body-parser' )
var session           = require( 'express-session' )
var passport 	        = require( 'passport' )
var User 		          = require( '../models/user.server.model' )
                        require( 'datejs' )
                        require( './passport' )( passport );

var app               = express( );

app.use( express.static( 'client' ) );

if( process.env.NODE_ENV !== "test" ){
    app.use( logger('dev') );
}

app.use( cookieParser() ); 
app.use( bodyParser.json() ); 
app.use( bodyParser.urlencoded({ extended: false }) );

app.use( session({
    secret: 'badsecret',
    resave: false,
    saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );

var itemRoutes = require( '../routes/item.server.routes.js' );
var userRoutes = require( '../routes/user.server.routes.js' );
var exchangeRoutes = require( '../routes/exchange.server.routes.js' );
var messageRoutes = require( '../routes/message.server.routes.js' );
var conversationRoutes = require( '../routes/conversation.server.routes.js' );
var feedbackRoutes = require( '../routes/feedback.server.routes.js' );
var groupRoutes = require( '../routes/group.server.routes.js' );
var notificationRoutes = require( '../routes/notification.server.routes.js' );
var authRoutes = require( '../routes/authentication.server.routes.js' )( passport )
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);

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

var server = http.createServer( app );
var io = socketio.listen( server );
app.set( 'socketio', io );
app.set( 'server', server );

module.exports = app;
