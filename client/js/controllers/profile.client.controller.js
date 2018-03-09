angular.module('myApp').controller('profileController', function( AuthService, UserService, NotificationService, UtilityService, SocketService, $scope, $location ){

    $scope.UtilityService = UtilityService
    $scope.error = {}

      AuthService.getUser( ).then( function( user ){
        
          $scope.user = user;

      }).catch( function( err ){
        
          setError( "Cannot get user" )
      });
  


    $scope.updateProfile = function(){

        clearError()

        UserService.updateUser( $scope.user ).then( function(){

            $location.path("/profile");

        }, function(){

            setError( "Cannot update profile" )
        })

    }


    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }
    
    
})