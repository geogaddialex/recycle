module.exports = function( mongoose ){

	var mongoose = require( 'mongoose' )

	if( process.env.NODE_ENV !== "test" ){

		mongoose.connect('mongodb://admin:th3p455w0rd15@ds117156.mlab.com:17156/recycle'); 
		console.log("Connected to live DB")
	
	}else{

		mongoose.connect('mongodb://localhost:27017/test');
		console.log("Connected to local test DB")


	}	

}

// mongoimport -h ds117156.mlab.com:17156 -d recycle -c cities -u admin -p th3p455w0rd15 --file cities.json --jsonArray
// mongo ds117156.mlab.com:17156/recycle -u admin -p th3p455w0rd15

// db.cities.remove( { "country" : { $ne: "GB" } } )

// db.cities.renameCollection("locations")