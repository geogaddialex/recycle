angular.module('myApp').controller('homeController', function(  ){
    var vm = this;
})

angular.module('myApp').controller('profileController', [ 'AuthService', function( AuthService ){

    var vm = this;

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