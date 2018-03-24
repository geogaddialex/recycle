angular.module('myApp').controller('loginController', function ($scope, $location, AuthService, UtilityService, LocationService) {

    $scope.loginForm = {};
    $scope.formToShow = "Log in"
    $scope.formToggleText = "Join"
    $scope.error = {}

    $scope.registerForm = {
      email: "",
      password: "",
      confirmPassword: "",
      name: ""
    }


    $scope.login = function( ){

        clearError()

        AuthService.login( $scope.loginForm.email, $scope.loginForm.password ).then( function( ){

          $location.path('/profile');
        
        }).catch(function () {

          setError( "Invalid email and/or password" )

        });

    };

    $scope.register = function( ){

      clearError()

      if( !UtilityService.isValidUserName( $scope.registerForm.name ) ){

        setError( "Please enter a name" )
      
      }else if( !UtilityService.isValidEmail( $scope.registerForm.email ) ){

        setError( "Please enter a valid email address" )

      }else if( !UtilityService.isValidPassword( $scope.registerForm.password )){

        setError( "Password invalid, please make sure your password contains an uppercase letter, a lowercase letter, a number and a special character.")

      }else if( !UtilityService.passwordsMatch( $scope.registerForm.password, $scope.registerForm.confirmPassword )){

        setError( "The passwords you have entered do not match" )

      }else if( !UtilityService.isSanitary( $scope.registerForm.name ) ){

        setError( "The name can only contain letters, numbers, spaces and - / _ £ ? : . ," )
        
      }else if( !$scope.registerForm.location || !$scope.registerForm.location.name ){

        setError( "The location entered isn't recognised, please use a location from the list provided" )

      }else{

        UtilityService.isEmailTaken( $scope.registerForm.email ).then( function( result ){

          if( result === true ){

              setError( "The email you have entered is already in use" )

          }else{

            AuthService.register( $scope.registerForm ).then( function( ){

              $location.path( '/profile' );

            }).catch( function( ){
              
              setError( "Could not register" )

            });

          }

        },function(){


        })

      }

      
    };

    $scope.createLocal = function( ){

      clearError()

      if( !UtilityService.isValidUserName( $scope.registerForm.name ) ){

        setError( "Please enter a name" )
      
      }else if( !UtilityService.isValidEmail( $scope.registerForm.email ) ){

        setError( "Please enter a valid email address" )

      }else if( !UtilityService.isValidPassword( $scope.registerForm.password )){

        setError( "Password invalid, please make sure your password contains an uppercase letter, a lowercase letter, a number and a special character.")

      }else if( !UtilityService.passwordsMatch( $scope.registerForm.password, $scope.registerForm.confirmPassword )){

        setError( "The passwords you have entered do not match" )

      }else if( !UtilityService.isSanitary( $scope.registerForm.name ) ){

        setError( "The name can only contain letters, numbers, spaces and - / _ £ ? : . ," )
        
      }else if( !$scope.registerForm.location || !$scope.registerForm.location.name ){

        setError( "The location entered isn't recognised, please use a location from the list provided" )

      }else{

        AuthService.createLocal( $scope.registerForm.email, $scope.registerForm.password, $scope.registerForm.name ).then( function( ){

          $location.path( '/profile' );

        }).catch( function( ){
          
          setError( "Could not create local account" )

        });

      }

      
    };

    $scope.switchForm = function( ){

      clearError()

      if( $scope.formToShow == "Join" ){

          $scope.formToShow = "Log in"
          $scope.formToggleText = "Join"
      
      }else{

          LocationService.getLocations( ).then(function( locations ){

              $scope.locations = locations

          }, function(){

              setError("Cannot get locations")

          })

          $scope.formToShow = "Join"
          $scope.formToggleText = "Log in"

      }
          
      
    };


    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }

});

angular.module('myApp').controller('logoutController', function( $scope, $location, AuthService ){

    $scope.logout = function( ){

        clearError()

        AuthService.logout( ).then( function( ){

            $location.path( '/enter' );

        }, function(){

          setError( "Could not log out" )
        });
    };

    
    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }

});