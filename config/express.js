var config = require('./config'),
    express = require('express'),
    passport = require('passport'),
    bodyParser = require('body-parser');
    flash = require('connect-flash');
    session = require('express-session');

module.exports = function() {

    var expressApp = express();
    expressApp.use( express.static('./public') );
    expressApp.use( flash() );
    expressApp.use( passport.initialize() );
    expressApp.use( passport.session() );

    expressApp.use( bodyParser.urlencoded({
        extended: true
    }) );
    expressApp.use( bodyParser.json() );

    expressApp.use( session({
        saveUninitialized: true,
        resave: true,
        secret: 'OurSuperSecretCookieSecret'
    }));

    expressApp.set( 'views', './app/views' );
    expressApp.set( 'view engine', 'ejs' );

    require( '../app/routes/index.server.routes.js' )( expressApp );
    require( '../app/routes/users.server.routes.js' )( expressApp );

    return expressApp;
};
