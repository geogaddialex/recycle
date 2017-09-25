var config = require('./config'),
    mongoose = require('mongoose'),
    userModel = require('../app/models/user.server.model');

module.exports = function() {
    var db = mongoose.connect(config.db);
    return db;
};