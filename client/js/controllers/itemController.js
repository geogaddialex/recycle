angular.module('myApp').controller('itemController', [ '$routeParams', '$location', '$route', '$scope', 'SocketService', 'ItemService', 'AuthService', function( $routeParams, $location, $route, $scope, SocketService, ItemService, AuthService ){
    var vm = this;
    
    var itemId = $routeParams.id;

    AuthService.getUser().then( function(user){
      vm.user = user;
    

        //initialising different item pages

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

            ItemService.getItemsBelongingTo( vm.user._id ).then( function( items ){
              
              vm.myItems = items;

            }).catch( function( err ){
              console.log( "error = " + err );
              vm.myItems = {};
            });
        }


    });



    //Socket events

    SocketService.on('item.created', function( item ){
        // alert( "New item added: " + item.name );
    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });



    //Functions for browser use

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