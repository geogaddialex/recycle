angular.module('myApp').controller('profileController', function( $http, ngDialog, AuthService, UserService, NotificationService, FeedbackService, LocationService, UtilityService, SocketService, $scope, $location ){

    $scope.UtilityService = UtilityService
    $scope.error = {}
    $scope.success = {}

      AuthService.getUser( ).then( function( user ){
        
          $scope.user = user
          $scope.originalUser = user

          if( !user.location ){
            setError( "Please set your location to access the rest of the site" )
          }
          
          LocationService.getLocations( ).then(function( locations ){

              $scope.locations = locations

          }, function(){

              setError("Cannot get locations")

          })

          FeedbackService.getFeedbackRegarding( user._id ).then( function( feedbacks ){

            $scope.feedbacks = feedbacks

          }, function(){

              setError( "Cannot get feedback for user" )

          })

      }).catch( function( err ){
        
          setError( "Cannot get user" )
      });
  


    $scope.updateProfile = function(){

        clearError()

        if( !UtilityService.isValidUserName( $scope.user.local.name ) ){

            setError( "Please enter a name between 1 and 70 characters long" )

        }else if( !UtilityService.isValidEmail( $scope.user.local.email ) ){

            setError( "Please enter a valid email address" )

        }else if( !$scope.user.location || !$scope.user.location.name ){

          setError( "The location entered isn't recognised, please use a location from the list provided" )

        }else if( !UtilityService.isNumber( $scope.user.maxDistance )){

          setError( "The maximum distance must be a whole number" )

        }else if( $scope.user.maxDistance < 1 ){

          setError( "The minimum distance is 1 mile, but such a small distance may not return many results" )

        }else{

            UtilityService.isEmailTaken( $scope.user.local.email ).then( function( result ){

                if( result === true && $scope.user.local.email != $scope.originalUser.local.email ){

                    setError( "The email you have entered is already in use" )

                }else{

                    ngDialog.openConfirm({ 

                        template: '/partials/dialog_save_changes.html'

                    }).then(function (success) {

                        UserService.updateUser( $scope.user ).then( function(){

                            setSuccess( "Profile updated successfully")

                        }, function(){

                            setError( "Cannot update profile" )
                        })

                    }, function(error){

                    })
                }


            },function(){

              setError( "Something went wrong when checking if the email is already taken" )

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

    $scope.removeLocal = function(){

      ngDialog.openConfirm({ 

        template: '/partials/dialog_remove_local.html'
        
      }).then(function (success) {
          
          $http.get('/api/auth/unlink/local')

      }, function (error) {


      });


      
    }

    $scope.showAllFeedback = function( user ){

        $location.path( '/users/'+user._id+'/feedback' )
    }

    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      clearSuccess()
      $scope.error.message = message

    }

    var clearSuccess = function(){

      $scope.success.message = undefined

    }

    var setSuccess = function( message ){

      clearError()
      $scope.success.message = message

    }
    
    
})