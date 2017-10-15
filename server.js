var config = require('./config/config.js');

var passport = require('passport');
var mongoose = require('mongoose');
require('./config/passport')(passport);
require('./config/database')(mongoose);

var app = require('./config/express')(passport); 

app.listen(config.port);
console.log('Site live at port: ' + config.port);
