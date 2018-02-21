module.exports = function( mongoose ){

	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://admin:th3p455w0rd15@ds117156.mlab.com:17156/recycle'); 

}