angular.module( 'myApp' ).factory( 'FeedbackService', function( $q, $timeout, $http ){

    return ({
      getFeedbackRegarding: getFeedbackRegarding,
      createFeedback: createFeedback
    });


    function createFeedback( feedback ){
      return $http({ method: 'POST', url: '/api/feedback', data: feedback });
    }

    function getFeedbackRegarding( id ){
       
      var deferred = $q.defer();
      var url = '/api/feedback/forUser/'+id

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