angular.module( 'myApp' ).factory( 'ConversationService', [ '$q', '$timeout', '$http', function( $q, $timeout, $http ){

    return ({
      getConversations: getConversations,
      getConversation: getConversation,
      createConversation: createConversation,
      deleteConversation: deleteConversation,
      updateConversation: updateConversation
    });


    function createConversation( conversation ){
      return $http({ method: 'POST', url: '/api/conversations', data: conversation });
    }

    function deleteConversation( ID ){
      return $http({ method: 'DELETE', url: '/api/conversations/'+ID });
    }

    function updateConversation( conversation ){
      return $http({ method: 'PATCH', url: '/api/conversations/'+conversation._id, data: conversation });
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


    function getConversations(){
      
      var deferred = $q.defer();

      $http.get( '/api/conversations' ).then(
        function successCallback( res ) {

            if( res.data.conversations ){
              deferred.resolve( res.data.conversations );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){

          deferred.reject();
        }
      );

      return deferred.promise;
    }



    function getConversationsBelongingTo( id ){
       
      var deferred = $q.defer();
      var url = '/api/users/'+id+'/conversations'

      $http.get( url ).then(
        function successCallback( res ) {

            if( res.data.conversations ){
              deferred.resolve( res.data.conversations );
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