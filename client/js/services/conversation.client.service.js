angular.module( 'myApp' ).factory( 'ConversationService', function( $q, $timeout, $http ){

    return ({
      getConversation: getConversation,
      createConversation: createConversation,
      updateConversation: updateConversation
    });


    function createConversation( conversation ){
      return $http({ method: 'POST', url: '/api/conversations', data: conversation });
    }

    function updateConversation( conversation ){
      return $http({ method: 'PUT', url: '/api/conversations/'+conversation._id, data: conversation });
    }


    function getConversation( id ){

      var deferred = $q.defer();

      $http.get( '/api/conversations/'+id ).then(
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



});