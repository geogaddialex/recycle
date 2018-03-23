angular.module( 'myApp' ).factory( 'NotificationService', function( $q, $timeout, $http ){

    return ({
      getNotifications: getNotifications,
      createNotification: createNotification,
      updateNotification: updateNotification
    });


    function createNotification( notification ){
      return $http({ method: 'POST', url: '/api/notifications', data: notification });
    }

    function updateNotification( notification ){
      return $http({ method: 'PUT', url: '/api/notifications/'+notification._id, data: notification });
    }

    function getNotifications( ){
       
      var deferred = $q.defer();
      var url = '/api/notifications/'

      $http.get( url ).then(
        function successCallback( res ) {

            if( res.data.notifications ){
              deferred.resolve( res.data.notifications );
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