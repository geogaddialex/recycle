module.exports = function( mongoose ){

	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://admin:th3p455w0rd15@ds117156.mlab.com:17156/recycle'); 
		//185102 - josh case file for mlab uni port

}