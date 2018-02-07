angular.module('myApp').controller('profileController', [ 'AuthService', 'UserService', 'SocketService', '$scope', '$location', function( AuthService, UserService, SocketService, $scope, $location ){

    var path = $location.path()

    //needed to log in, not sure why
    $scope.authService = AuthService;

    //these two lines needed so that AuthService doesn't try to getUser before logged in (undefined error on login screen)
    AuthService.getUserStatus().then( function(){
      if( AuthService.isLoggedIn() ){
    
          AuthService.getUser( ).then( function( user ){
            $scope.user = user;

          }).catch( function( err ){
              console.log( "error = " + err );
          });
      }
    })

    $scope.updateProfile = function(){

      UserService.updateUser( $scope.user ).then( function(){

        $location.path("/profile");

      }, function(){
        alert( "Profile not updated" );
      })

    }


    // Socket events -------------------------------------------------------------------------------------------

    SocketService.on('exchange.created', function( exchange ){

      AuthService.getUser( ).then( function( user ){

        if( exchange.recipient._id == user._id ){

          alert("you have one new exchange")

        }

      })

    });

    SocketService.on('exchange.updated', function( exchange ){

      AuthService.getUser( ).then( function( user ){

        if( exchange.recipient._id == user._id && (path.split('/').indexOf('exchange') == -1) ){

            alert("Exchange " + exchange._id + " has been modified")

        }else{
          "not this user"
        }

      })
    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });

    
    
}])