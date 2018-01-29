angular.module( 'myApp' ).factory( 'MessageService', [ '$q', '$timeout', '$http', function( $q, $timeout, $http ){

    return ({
      getMessages: getMessages,
      getMessage: getMessage,
      createMessage: createMessage,
      deleteMessage: deleteMessage,
      updateMessage: updateMessage,
      getMessagesBelongingTo: getMessagesBelongingTo
    });


    function createMessage( message ){
      return $http({ method: 'POST', url: '/api/messages', data: message });
    }

    function deleteMessage( ID ){
      return $http({ method: 'DELETE', url: '/api/messages/'+ID });
    }

    function updateMessage( message ){
      return $http({ method: 'PATCH', url: '/api/messages/'+message._id, data: message });
    }


    function getMessage( id ){

      var deferred = $q.defer();

      $http.get( '/api/messages/'+id ).then(
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


    function getMessages(){
      
      var deferred = $q.defer();

      $http.get( '/api/messages' ).then(
        function successCallback( res ) {

            if( res.data.messages ){
              deferred.resolve( res.data.messages );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){

          deferred.reject();
        }
      );

      return deferred.promise;
    }



    function getMessagesBelongingTo( id ){
       
      var deferred = $q.defer();
      var url = '/api/users/'+id+'/messages'

      $http.get( url ).then(
        function successCallback( res ) {

            if( res.data.messages ){
              deferred.resolve( res.data.messages );
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