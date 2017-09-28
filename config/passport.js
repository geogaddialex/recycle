var passport = require('passport');
var mongoose = require('mongoose');

module.exports = function() {
    var User = mongoose.model('User');
    require('./passportStrategies/local.js')();

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne(
            {_id: id},
            '-password',
            function(err, user) {
                done(err, user);
            }
        );
    });

};