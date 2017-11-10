angular.module('myApp').controller('errorController', function( ){
    var vm = this;
})

angular.module('myApp').controller('homeController', function( ){
    var vm = this;
    vm.message = "";
})

angular.module('myApp').controller('profileController', [ 'AuthService', function( AuthService ){

    var vm = this;

    AuthService.getUser( ).then( function( user ){
      vm.user = user;
    });

}])