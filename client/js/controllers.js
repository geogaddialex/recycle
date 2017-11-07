angular.module('myApp').controller('itemController', function( $http ){
    var vm = this;
    vm.message = 'sample';
    vm.items = {};

    // vm.list = function( req, res ){
    //     $http.get( "/api/items" ).then( function( response ){
    //         console.log( vm.items );
    //         vm.items = response;
    //         console.log( vm.items );
    //     })
    // }

    // vm.list();

});

angular.module('myApp').controller('errorController', function( ){
    var vm = this;
})

angular.module('myApp').controller('homeController', function( ){
    var vm = this;
})

angular.module('myApp').controller('loginController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

            $scope.loginForm = {};
            $scope.registerForm = {};

    $scope.login = function( ){
      $scope.error = false;
      $scope.disabled = true;

      AuthService.login( $scope.loginForm.username, $scope.loginForm.password )
        .then( function( ){
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };


    $scope.register = function( ){
      $scope.error = false;
      $scope.disabled = true;

      AuthService.register( $scope.registerForm.username, $scope.registerForm.password, $scope.registerForm.email )
        .then( function( ){
          $location.path( '/login' );
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        .catch( function( ){
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });
    };

    $scope.switch = function( to ){

      var fadeTime = 0;

      if( to === "register" ){
        $( "#register-form" ).delay( fadeTime ).fadeIn( fadeTime );
        $( "#login-form" ).fadeOut( fadeTime );
        $( '#login-form-link' ).removeClass( 'active' );
        $( '#register-form-link' ).addClass( 'active' );
      }else{
        $( "#login-form" ).delay( fadeTime ).fadeIn( fadeTime );
        $( "#register-form" ).fadeOut( fadeTime );
        $( '#register-form-link' ).removeClass( 'active' );
        $( '#login-form-link' ).addClass( 'active' );
      }
    }

}]);

angular.module('myApp').controller('logoutController', ['$scope', '$location', 'AuthService', function( $scope, $location, AuthService ){

    $scope.logout = function( ){
        AuthService.logout( ).then( function( ){
            $location.path( '/login' );
        });
    };

}]);