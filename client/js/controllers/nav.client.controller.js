angular.module('myApp').controller('navController', function( $location, AuthService, UserService, NotificationService, UtilityService, SocketService, $scope, $location ){

    var path = $location.path()

    $scope.authService = AuthService;
    $scope.UtilityService = UtilityService
    $scope.error = {}

    //these two lines needed so that AuthService doesn't try to getUser before logged in (undefined error on login screen)
    AuthService.getUserStatus().then( function(){
      if( AuthService.isLoggedIn() ){
    
          AuthService.getUser( ).then( function( user ){
            $scope.user = user;

            NotificationService.getNotifications( ).then( function( notifications ){

              $scope.notifications = notifications
              $scope.unreadNotifications = $scope.notifications.some(checkUnread);

            }, function(){

              setError( "Cannot get notifications" )

            })

          }, function( err ){

              setError( "Cannot get user" )
          });
      }
    }, function(){

        setError( "Cannot get user status" )
    })


    $scope.markRead = function( event, notification ){

      clearError()
      event.preventDefault()
      event.stopPropagation()
      notification.read = true

      NotificationService.updateNotification( notification ).then( function( ){

          $scope.unreadNotifications = $scope.notifications.some(checkUnread);

      }, function(err){

          setError( "Cannot update notifications" )
      })
      
    }

    $scope.markReadAndView = function( event, notification ){

      clearError()
      event.preventDefault()
      event.stopPropagation()
      notification.read = true

      NotificationService.updateNotification( notification ).then( function( ){

          $scope.unreadNotifications = $scope.notifications.some(checkUnread);
          $location.path( notification.link );

      }, function(err){

          setError( "Cannot update notifications" )
      })
      
    }

    $scope.search = function( query ){

      if( UtilityService.isValidMessage( query ) ){

          $location.path( "/search/"+query );

      }

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

      }, function(err){

          setError( "Cannot get user" )
      })

        

    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();

    });


    var checkUnread = function(notification) {
      return !notification.read;
    }


    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }
  
    
})