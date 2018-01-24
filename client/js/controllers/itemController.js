angular.module('myApp').controller('itemController', [ '$routeParams', '$location', '$route', 'ItemService', 'AuthService', function( $routeParams, $location, $route, ItemService, AuthService ){
    var vm = this;

    vm.user = "";
    vm.singleItem = "";
    
    var itemId = $routeParams.id;

    AuthService.getUser().then( function(user){
      vm.user = user;
    });

    //if there is an item ID then user must be on a single item page
    if( itemId ){

      ItemService.getItem( itemId ).then( function( item ){
        vm.singleItem = item;
        vm.viewingOwnItem = vm.user._id == item.owner._id
      }).catch( function( err ){
        console.log( "error = " + err );
      });
    }

    if( $location.path() == "/items" ){
      ItemService.getItems( ).then( function( items ){
        vm.items = items;
      }).catch( function( err ){
          console.log( "error = " + err );
      });
    }
    

    if( $location.path() == "/myItems" ){
      AuthService.getUser( ).then( function( user ){
        ItemService.getItemsBelongingTo( user._id ).then( function( items ){
          vm.myItems = items;

        }).catch( function( err ){
          console.log( "error = " + err );
          vm.myItems = {};
        });
      });
    }
   


    vm.createItem = function( item ){

      ItemService.createItem( item ).then( function( ){ 
          $location.path("/myItems");
       }, function(){
          alert( "Item not created" );
       })
    }

    vm.deleteItem = function( ID ){

      ItemService.deleteItem( ID ).then( function( ){ 
          $route.reload();
       }, function(){
          alert( "Item not deleted" );
       })
    }

    vm.updateItem = function(){

      ItemService.updateItem( vm.singleItem ).then( function(){

        $location.path("/myItems");

      }, function(){
        alert( "Item not updated" );
      })

    }


}]);