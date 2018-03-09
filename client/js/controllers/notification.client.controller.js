angular.module('myApp').controller('notificationController', function( AuthService, UserService, NotificationService, UtilityService, SocketService, $scope, $location ){

    var path = $location.path()
    $scope.UtilityService = UtilityService
    $scope.error = {}

    AuthService.getUser( ).then( function( user ){
      $scope.user = user;

      NotificationService.getNotifications( ).then( function( notifications ){

        $scope.notifications = notifications

      }, function(){

        setError( "Cannot get notifications" )

      })

    }).catch( function( err ){
        
      setError( "Cannot get user" )

    });


    $scope.markRead = function( event, notification ){

      clearError()

      event.preventDefault()
      notification.read = true

      NotificationService.updateNotification( notification ).then( function( notification ){


      }, function(){

        setError( "Cannot update notifications" )
      })
      
    }

    SocketService.on('notification.created', function( notification ){

        if( notification.user == $scope.user._id ){

          $scope.notifications.push( notification )
          $scope.$apply()

        }

    });

    SocketService.on('notification.updated', function( notification ){

        if( notification.user === $scope.user._id ){

          var index = $scope.notifications.findIndex(x => x._id == notification._id);

          $scope.notifications[index] = notification
          $scope.$apply()

        }

    });


    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }
    
})