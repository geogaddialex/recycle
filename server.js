var config = require( './server/config/config.js' );

var mongoose = require( 'mongoose' );
require( './server/config/database' )( mongoose );

var app = require( './server/config/express' ); 

app.listen( config.port );
console.log( 'Site live at port: ' + config.port );
