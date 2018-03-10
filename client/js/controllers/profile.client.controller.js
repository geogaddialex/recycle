angular.module('myApp').controller('profileController', function( ngDialog, AuthService, UserService, NotificationService, UtilityService, SocketService, $scope, $location ){

    $scope.UtilityService = UtilityService
    $scope.error = {}

      AuthService.getUser( ).then( function( user ){
        
          $scope.user = user
          $scope.originalUser = user

      }).catch( function( err ){
        
          setError( "Cannot get user" )
      });
  


    $scope.updateProfile = function(){

        clearError()

        if( !UtilityService.isValidUserName( $scope.user.local.name ) ){

            setError( "Your name cannot be empty" )

        }else if( !UtilityService.isValidEmail( $scope.user.local.email ) ){

            setError( "Please enter a valid email address" )

        }else{

            UtilityService.isEmailTaken( $scope.user.local.email ).then( function( result ){

                if( result === true && $scope.user.local.email != $scope.originalUser.local.email ){

                    setError( "The email you have entered is already in use" )

                }else{

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


            },function(){


            })

        }

      
    }

    $scope.resetProfile = function(){

      clearError()

      ngDialog.openConfirm({ 

          template: '/partials/dialog_reset_changes.html'
          
        }).then(function (success) {
            
            $scope.user = $scope.originalUser;

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