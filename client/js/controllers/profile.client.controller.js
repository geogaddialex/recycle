angular.module('myApp').controller('profileController', function( ngDialog, AuthService, UserService, NotificationService, UtilityService, SocketService, $scope, $location ){

    $scope.UtilityService = UtilityService
    $scope.error = {}

      AuthService.getUser( ).then( function( user ){
        
          $scope.user = user;

      }).catch( function( err ){
        
          setError( "Cannot get user" )
      });
  


    $scope.updateProfile = function(){

        clearError()

        ngDialog.openConfirm({ 

            template: '/partials/dialog_save_changes.html'

        }).then(function (success) {

            UserService.updateUser( $scope.user ).then( function(){

                $location.path("/profile");

            }, function(){

                setError( "Cannot update profile" )
            })

        }, function(error){

        })

    }

    $scope.resetProfile = function(){

      clearError()

      ngDialog.openConfirm({ 

          template: '/partials/dialog_reset_changes.html'
          
        }).then(function (success) {

            AuthService.getUser( ).then( function( user ){

                $scope.user = user;

            }, function(){

              setError( "Something went wrong" )

            })

        }, function (error) {


        });

    }


    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }
    
    
})