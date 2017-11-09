module.exports = function( mongoose ){

	var config = require('./config');
	mongoose.Promise = global.Promise;
	mongoose.connect(config.dbURL); 

}