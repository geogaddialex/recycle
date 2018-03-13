angular.module('myApp').controller('profileController', function( ngDialog, AuthService, UserService, NotificationService, FeedbackService, LocationService, UtilityService, SocketService, $scope, $location ){

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
  


    $scope.updateLocal = function(){

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

                            setSuccess( "Profile updated successfully")

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

    $scope.updateLocation = function(){

      clearError()
      
      if( !$scope.user.location || !$scope.user.location.name ){

          setError( "The location entered isn't recognised, please use a location from the list provided" )

      }else{

          ngDialog.openConfirm({ 

              template: '/partials/dialog_save_changes.html'

          }).then(function (success) {

              UserService.updateUser( $scope.user ).then( function(){

                  setSuccess( "Location updated successfully")

              }, function(){

                  setError( "Cannot update profile" )
              })

          }, function(error){

          })
      }

      
    }

    $scope.reset = function(){

      clearError()

      ngDialog.openConfirm({ 

          template: '/partials/dialog_reset_changes.html'
          
        }).then(function (success) {
            
            $scope.user = $scope.originalUser;

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