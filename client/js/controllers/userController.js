angular.module('myApp').controller('userController', [ '$routeParams', '$location', 'ItemService', 'AuthService', 'UserService', function( $routeParams, $location, ItemService, AuthService, UserService ){
    var vm = this;

    if( $location.path() == "/users" ){
      UserService.getUsers( ).then( function( users ){
        vm.users = users;
      });
    }

    if( $location.path().indexOf( "/users/" ) > -1 ){ //better way to see if there are items after the slash?

      var username = $routeParams.username;

      UserService.getUserByName( username ).then( function( user ){
        vm.singleUser = user;

        ItemService.getItemsBelongingTo( vm.singleUser._id ).then( function( items ){
          vm.singleUser.items = items;

        }).catch( function( err ){
          console.log( "error = " + err );
          vm.singleUser.items = {};
        });  

      }).catch(function( err ){
        console.log("err: " + err)
      });
     
    }
    

}]);