angular.module( 'myApp' ).factory( 'TagService', function( $q, $timeout, $http ){

    return ({
      getTag: getTag,
      getTags: getTags,
      createTag: createTag,
      deleteTag: deleteTag,
    });

    function getTag( name ){

      var deferred = $q.defer();

      $http.get( '/api/tags/'+name ).then(
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


    function createTag( tag ){
      return $http({ method: 'POST', url: '/api/tags', data: tag });
    }

    function deleteTag( ID ){
      return $http({ method: 'DELETE', url: '/api/tags/'+ID });
    }

    function getTags(){
      
      var deferred = $q.defer();

      $http.get( '/api/tags' ).then(
        function successCallback( res ) {

            if( res.data.tags ){
              deferred.resolve( res.data.tags );
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