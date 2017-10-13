var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var itemSchema = mongoose.Schema({
        name: String
});

module.exports = mongoose.model( 'Item', itemSchema );