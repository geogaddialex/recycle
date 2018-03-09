angular.module( 'myApp' ).factory( 'FeedbackService', function( $q, $timeout, $http ){

    return ({
      getFeedback: getFeedback,
      getFeedbackRegarding: getFeedbackRegarding,
      createFeedback: createFeedback,
      deleteFeedback: deleteFeedback
    });


    function createFeedback( feedback ){
      return $http({ method: 'POST', url: '/api/feedback', data: feedback });
    }

    function deleteFeedback( ID ){
      return $http({ method: 'DELETE', url: '/api/feedback/'+ID });
    }

    function getFeedback( id ){

      var deferred = $q.defer();

      $http.get( '/api/feedback/'+id ).then(
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


    function getFeedbackRegarding( id ){
       
      var deferred = $q.defer();
      var url = '/api/users/'+id+'/feedback'

      $http.get( url ).then(
        function successCallback( res ) {

            if( res.data.feedback ){
              deferred.resolve( res.data.feedback );
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
    


});