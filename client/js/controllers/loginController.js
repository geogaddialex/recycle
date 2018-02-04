angular.module('myApp').controller('loginController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

    $scope.loginForm = {};
    $scope.registerForm = {};
    $scope.formToShow = "Join"
    $scope.formToggleText = "Log in"


    $scope.login = function( ){

      AuthService.login( $scope.loginForm.email, $scope.loginForm.password ).then( function( ){

          $location.path('/');
        
        }).catch(function () {

          $scope.errorMessage = "Invalid email and/or password";

        });

    };

    $scope.register = function( ){

      AuthService.register( $scope.registerForm.email, $scope.registerForm.password, $scope.registerForm.name ).then( function( ){

          $location.path( '/' );

        }).catch( function( ){
          
          $scope.errorMessage = "Something went wrong!";

        });
    };

    $scope.createLocal = function( ){

      AuthService.createLocal( $scope.registerForm.email, $scope.registerForm.password, $scope.registerForm.name ).then( function( ){

          $location.path( '/profile' );

        }).catch( function( ){
          
          $scope.errorMessage = "Something went wrong!";

        });
    };

    $scope.switchForm = function( ){

          if( $scope.formToShow == "Join" ){

              $scope.formToShow = "Log in"
              $scope.formToggleText = "Join"
          
          }else{

              $scope.formToShow = "Join"
              $scope.formToggleText = "Log in"

          }
          
      
    };

}]);

angular.module('myApp').controller('logoutController', ['$scope', '$location', 'AuthService', function( $scope, $location, AuthService ){

    $scope.logout = function( ){
        AuthService.logout( ).then( function( ){
            $location.path( '/' );
        });
    };

}]);