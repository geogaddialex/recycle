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

          console.log()

          $scope.unreadNotifications = $scope.notifications.some(checkUnread);

      }).catch( function(err){

          console.log("didn't update (mark read)")
      })
      
    }

    $scope.hide = function( event, notification ){

      event.preventDefault();
      event.stopPropagation()

      notification.hidden = true
      notification.read = true

      NotificationService.updateNotification( notification ).then( function( notification ){

          $scope.unreadNotifications = $scope.notifications.some(checkUnread);

      }).catch( function(err){

          console.log("didn't update (hide)")
      })
      
    }


    // Socket events -------------------------------------------------------------------------------------------

    SocketService.on('exchange.created', function( exchange ){

        if( exchange.recipient._id == $scope.user._id ){

            createNotification( "A user has made you a new offer", "/exchange/"+exchange._id )

        }

    });

    SocketService.on('exchange.updated', function( exchange ){

        if( exchange.lastUpdatedBy != $scope.user._id ){

            createNotification( "One of your exchanges has been modified", "/exchange/"+exchange._id )

        }

    });

    SocketService.on('notification.created', function( notification ){


        if( notification.user === $scope.user._id ){

          $scope.notifications.push( notification )
          $scope.unreadNotifications = true
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
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();

    });


    var checkUnread = function(notification) {
      return !notification.read;
    }

    var createNotification = function( message, link ){


      var notification = {

        user: $scope.user,
        message: message,
        link: link

      }

      NotificationService.createNotification( notification ).then(function(notification){


          console.log( "notification created (by service)" )

      }),function(err){

        console.log("not created by service: " + err)
      }

    }
    
    
}])