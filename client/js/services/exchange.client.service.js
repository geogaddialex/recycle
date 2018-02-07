angular.module( 'myApp' ).factory( 'ExchangeService', [ '$q', '$timeout', '$http', function( $q, $timeout, $http ){

    return ({
      getExchanges: getExchanges,
      getExchange: getExchange,
      getExchangesInvolving: getExchangesInvolving,
      createExchange: createExchange,
      amendExchange: amendExchange
    });


    function createExchange( exchange ){
      return $http({ method: 'POST', url: '/api/exchanges', data: exchange });
    }

    function amendExchange( exchange ){
      return $http({ method: 'PATCH', url: '/api/exchanges/'+exchange._id, data: exchange });
    }

    function getExchange( id ){

      var deferred = $q.defer();

      $http.get( '/api/exchanges/'+id ).then(
        function successCallback( res ) {

            if( res.data ){
              deferred.resolve( res.data );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){

          deferred.reject();
        }
      );

      return deferred.promise;
    }


    function getExchanges(){
      
      var deferred = $q.defer();

      $http.get( '/api/exchanges' ).then(
        function successCallback( res ) {

            if( res.data.exchanges ){
              deferred.resolve( res.data.exchanges );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){

          deferred.reject();
        }
      );

      return deferred.promise;
    }


    function getExchangesInvolving( id ){
       
      var deferred = $q.defer();
      var url = '/api/users/'+id+'/exchanges'

      $http.get( url ).then(
        function successCallback( res ) {

            if( res.data.exchanges ){
              deferred.resolve( res.data.exchanges );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){

          console.log( "error: " + res.data );

          deferred.reject();
        }
      ).catch( function( err ){
        console.log( "caught error: " + err );
      });

      return deferred.promise;
    }
    


}]);