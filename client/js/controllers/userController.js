angular.module('myApp').controller('userController', [ '$routeParams', 'ItemService', 'AuthService', 'UserService', function( $routeParams, ItemService, AuthService, UserService ){
    var vm = this;
    
    var usernameToDisplay = $routeParams.username;

    if( usernameToDisplay ){
      UserService.getUserByName( usernameToDisplay ).then( function( user ){
        vm.singleUser = user;
      });
    }

    UserService.getUsers( ).then( function( users ){
      vm.users = users;
    });

    vm.createUser = function( user ){

      UserService.createItem( user ).then( function( ){ 
          alert( 'created successfully!!!' ); 
       }, function(){
          alert( 'something bad' );
       })
    }

}]);