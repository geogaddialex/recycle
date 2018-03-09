angular.module('myApp').controller('loginController', function ($scope, $location, geolocation, AuthService) {

    $scope.loginForm = {};
    $scope.registerForm = {};
    $scope.formToShow = "Log in"
    $scope.formToggleText = "Join"
    $scope.error = {}


    $scope.login = function( ){

        clearError()

        AuthService.login( $scope.loginForm.email, $scope.loginForm.password ).then( function( ){

          $location.path('/profile');
        
        }).catch(function () {

          setError( "Invalid email and/or passowrd" )

        });

    };

    $scope.register = function( ){

        // geolocation.getLocation().then(function(data){

        //   var location = {lat: data.coords.latitude, long: data.coords.longitude}
        // });

      clearError()

      AuthService.register( $scope.registerForm.email, $scope.registerForm.password, $scope.registerForm.name ).then( function( ){

          $location.path( '/profile' );

        }).catch( function( ){
          
          setError( "Could not register" )

        });
    };

    $scope.createLocal = function( ){

      clearError()

      AuthService.createLocal( $scope.registerForm.email, $scope.registerForm.password, $scope.registerForm.name ).then( function( ){

          $location.path( '/profile' );

        }).catch( function( ){
          
          setError( "Could not create local account" )

        });
    };

    $scope.switchForm = function( ){

      clearError()

          if( $scope.formToShow == "Join" ){

              $scope.formToShow = "Log in"
              $scope.formToggleText = "Join"
          
          }else{

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