var mongoose = require( 'mongoose' );
require( './server/config/database' )( mongoose );

var app = require( './server/config/express' ); 
var port = process.env.PORT || 8080

app.get('server').listen( port );
console.log( 'Site live at port: ' + port );

module.exports = app; // for testing
