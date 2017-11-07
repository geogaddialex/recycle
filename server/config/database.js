module.exports = function( mongoose ){

	var config = require('./config');
	mongoose.connect(config.dbURL); 

}