angular.module('myApp').controller('homeController', function(  ){
    var vm = this;
})

angular.module('myApp').controller('profileController', [ 'AuthService', 'UserService', '$scope', '$location', function( AuthService, UserService, $scope, $location ){

    var vm = this;
    vm.user = "";

    //needed to log in, not sure why
    vm.authService = AuthService;


    //these two lines needed so that AuthService doesn't try to getUser before logged in (undefined error on login screen)
    AuthService.getUserStatus().then( function(){
      if( AuthService.isLoggedIn() ){
    
          AuthService.getUser( ).then( function( user ){
            vm.user = user;
          }).catch( function( err ){
              console.log( "error = " + err );
          });
      }
    })

    vm.updateProfile = function(){

      UserService.updateUser( vm.user ).then( function(){

        $location.path("/profile");

      }, function(){
        alert( "Profile not updated" );
      })

    }

    
    
}])