angular.module( 'myApp' ).factory( 'ItemService', [ '$q', '$timeout', '$http', function( $q, $timeout, $http ){

    return ({
      getItems: getItems,
      getItem: getItem,
      createItem: createItem
    });


    function createItem( item ){
      return $http({ method: 'POST', url: '/api/items', data: item });
    }


    function getItems(){
      
      var deferred = $q.defer();

      $http.get( '/api/items' ).then(
        function successCallback( res ) {

            if( res.data.items ){
              deferred.resolve( res.data.items );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){

          deferred.reject();
        }
      );

      return deferred.promise;
    }


    function getItem( id ){

      var deferred = $q.defer();

      $http.get( '/api/items/'+id ).then(
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


}]);