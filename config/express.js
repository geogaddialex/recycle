var config = require('./config');
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');

module.exports = function() {
    var expressApp = express();

    expressApp.use( express.static('./public') );
    expressApp.use( flash() );
    expressApp.use( passport.initialize() );
    expressApp.use( passport.session() );
    expressApp.use( bodyParser.json() );

    expressApp.use( bodyParser.urlencoded({
        extended: true
    }) );
    
    expressApp.use( session({
        saveUninitialized: true,
        resave: true,
        secret: 'OurSuperSecretCookieSecret'
    }));

    expressApp.set( 'views', './app/views' );
    expressApp.set( 'view engine', 'ejs' );

    require( '../app/routes/indexRoutes.js' )( expressApp );
    require( '../app/routes/userRoutes.js' )( expressApp );

    return expressApp;
};
