angular.module('myApp').controller('notificationController', [ 'AuthService', 'UserService', 'NotificationService', 'UtilityService', 'SocketService', '$scope', '$location', function( AuthService, UserService, NotificationService, UtilityService, SocketService, $scope, $location ){

    var path = $location.path()

    //needed to log in, not sure why
    $scope.UtilityService = UtilityService

    AuthService.getUser( ).then( function( user ){
      $scope.user = user;

      NotificationService.getNotifications( ).then( function( notifications ){

        $scope.notifications = notifications

      })

    }).catch( function( err ){
        console.log( "error = " + err );
    });


    $scope.markRead = function( event, notification ){

      event.preventDefault()
      notification.read = true

      NotificationService.updateNotification( notification ).then( function( notification ){


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
    
}])