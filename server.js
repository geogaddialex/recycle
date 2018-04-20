var mongoose = require( 'mongoose' )
require( './server/config/database' )( mongoose )
var app = require( './server/config/express' )

module.exports = app
