angular.module('myApp').controller('homeController', function(  ){
    var vm = this;
})

angular.module('myApp').controller('profileController', [ 'AuthService', '$scope', function( AuthService, $scope ){

    var vm = this;
    vm.authService = AuthService;

    AuthService.getUserStatus().then( function(){
        if( AuthService.isLoggedIn() ){

            AuthService.getUser( ).then( function( user ){
              vm.user = user;
            }).catch( function( err ){
                console.log( "error eh = " + err );
            });
        }
    });

    
    
}])