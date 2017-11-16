angular.module('myApp').controller('exchangeController', [ '$routeParams', '$location', 'ItemService', 'AuthService', 'UserService', function( $routeParams, $location, ItemService, AuthService, UserService ){
    var vm = this;
    
    var item = $routeParams.item;
    var username = $routeParams.username;


    if( username ){
      UserService.getUserByName( username ).then( function( user ){
          
          vm.otherUser = user;

          ItemService.getItemsBelongingTo( vm.otherUser._id ).then( function( items ){
            vm.otherUser.items = items;

          }).catch( function( err ){
            console.log( "error = " + err );
            vm.otherUser.items = {};
          });  

      }).catch(function( err ){
        console.log("err: " + err)
      });
    }






    if( $location.path() == "/items" ){
      ItemService.getItems( ).then( function( items ){
        vm.items = items;
      }).catch( function( err ){
          console.log( "error = " + err );
      });
    }
    


      AuthService.getUser( ).then( function( user ){
        ItemService.getItemsBelongingTo( user._id ).then( function( items ){
          vm.myItems = items;

        }).catch( function( err ){
          console.log( "error = " + err );
          vm.myItems = {};
        });
      });

}]);