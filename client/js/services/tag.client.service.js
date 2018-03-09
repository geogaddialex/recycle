angular.module( 'myApp' ).factory( 'TagService', function( $q, $timeout, $http ){

    return ({
      getTags: getTags,
      createTag: createTag,
      deleteTag: deleteTag,
    });


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