module.exports = function( mongoose ){

	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://admin:th3p455w0rd15@ds117156.mlab.com:17156/recycle'); 

}

// mongoimport -h ds117156.mlab.com:17156 -d recycle -c cities -u admin -p th3p455w0rd15 --file cities.json --jsonArray
// mongo ds117156.mlab.com:17156/recycle -u admin -p th3p455w0rd15

// db.cities.remove( { "country" : { $ne: "GB" } } )

// db.cities.renameCollection("locations")