angular.module('myApp').controller('navController', [ 'AuthService', 'UserService', 'NotificationService', 'UtilityService', 'SocketService', '$scope', '$location', function( AuthService, UserService, NotificationService, UtilityService, SocketService, $scope, $location ){

    var path = $location.path()

    //needed to log in, not sure why
    $scope.authService = AuthService;
    $scope.UtilityService = UtilityService

    //these two lines needed so that AuthService doesn't try to getUser before logged in (undefined error on login screen)
    AuthService.getUserStatus().then( function(){
      if( AuthService.isLoggedIn() ){
    
          AuthService.getUser( ).then( function( user ){
            $scope.user = user;

            NotificationService.getNotifications( ).then( function( notifications ){

              $scope.notifications = notifications
              $scope.unreadNotifications = $scope.notifications.some(checkUnread);

            })

          }).catch( function( err ){
              console.log( "error = " + err );
          });
      }
    })


    $scope.markRead = function( notification, event ){

      if(event){

        event.preventDefault()
        event.stopPropagation()

      }

      notification.read = true

      NotificationService.updateNotification( notification ).then( function( ){

          $scope.unreadNotifications = $scope.notifications.some(checkUnread);

      }).catch( function(err){

          console.log("didn't update (mark read)")
      })
      
    }


    SocketService.on('notification.created', function( notification ){

        if( notification.user._id === $scope.user._id ){

          $scope.notifications.push( notification )
          $scope.unreadNotifications = true
          $scope.$apply()

        }

    });

    SocketService.on('notification.updated', function( notification ){

      AuthService.getUser( ).then( function( user ){
      
        if( notification.user === $scope.user._id ){

          var index = $scope.notifications.findIndex(x => x._id == notification._id);
          $scope.notifications[index] = notification

          $scope.unreadNotifications = $scope.notifications.some(checkUnread);


        }
      }).catch( function(err){
        console.log(err)
      })

        

    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();

    });


    var checkUnread = function(notification) {
      return !notification.read;
    }

    // var createNotification = function( message, link ){


    //   var notification = {

    //     user: $scope.user,
    //     message: message,
    //     link: link

    //   }

    //   NotificationService.createNotification( notification ).then(function(notification){


    //       console.log( "notification created (by service)" )

    //   }).catch(function(err){

    //     console.log("notification not created by service: " + err)
    //   })

    // }
    
    
}])