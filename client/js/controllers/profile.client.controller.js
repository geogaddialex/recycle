angular.module('myApp').controller('profileController', [ 'AuthService', 'UserService', 'NotificationService', 'UtilityService', 'SocketService', '$scope', '$location', function( AuthService, UserService, NotificationService, UtilityService, SocketService, $scope, $location ){

    // var path = $location.path()  
    
      AuthService.getUser( ).then( function( user ){
        
          $scope.user = user;

      }).catch( function( err ){
        
          console.log( "error = " + err );
      });
  


    $scope.updateProfile = function(){

        UserService.updateUser( $scope.user ).then( function(){

            $location.path("/profile");

        }, function(){

            alert( "Profile not updated" );
        })

    }
    
    
}])