var config = require('./config');
var mongoose = require('mongoose');
var userModel = require('../app/models/userModel');

module.exports = function() {
    var db = mongoose.connect(config.db);
    return db;
};