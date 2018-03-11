angular.module( 'myApp' ).factory( 'LocationService', function( $q, $timeout, $http ){

    return ({
      getLocations: getLocations
    });


    function getLocations(){
      
      var deferred = $q.defer();

      $http.get( '/api/locations' ).then(
        function successCallback( res ) {

            if( res.data.locations ){
              deferred.resolve( res.data.locations );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){

          deferred.reject();
        }
      );

      return deferred.promise;
    }


});