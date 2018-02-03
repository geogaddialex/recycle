angular.module('myApp').controller('loginController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

    $scope.loginForm = {};
    $scope.registerForm = {};

    $scope.login = function( ){

      AuthService.login( $scope.loginForm.username, $scope.loginForm.password ).then( function( ){

          $location.path('/');
        
        }).catch(function () {

          $scope.errorMessage = "Invalid username and/or password";
          $scope.loginForm = {};

        });

    };

    $scope.facebookLogin = function( ){

      AuthService.facebookLogin( ).then( function( ){

          $location.path('/');

        }).catch(function () {

          $scope.errorMessage = "Cannot login via Facebook, try another method";

        });

    };


    $scope.register = function( ){

      AuthService.register( $scope.registerForm.username, $scope.registerForm.password, $scope.registerForm.email ).then( function( ){

          $location.path( '/login' );

        }).catch( function( ){
          
          $scope.errorMessage = "Something went wrong!";
          $scope.registerForm = {};

        });
    };

}]);

angular.module('myApp').controller('logoutController', ['$scope', '$location', 'AuthService', function( $scope, $location, AuthService ){

    $scope.logout = function( ){
        AuthService.logout( ).then( function( ){
            $location.path( '/' );
        });
    };

}]);