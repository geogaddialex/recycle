angular.module('myApp').controller('itemController', [ '$routeParams', '$location', '$route', '$scope', 'SocketService', 'ItemService', 'AuthService', function( $routeParams, $location, $route, $scope, SocketService, ItemService, AuthService ){
    
    var itemId = $routeParams.id;

    AuthService.getUser().then( function(user){
      $scope.user = user;
    

        //initialising different item pages

        if( itemId ){

          ItemService.getItem( itemId ).then( function( item ){

            $scope.item = item;
            $scope.viewingOwnItem = $scope.user._id == item.owner._id
            $scope.ownerName = $scope.getOwnerName( item.owner )

          }).catch( function( err ){
            console.log( "error = " + err );
          });
        }

        if( $location.path() == "/items" ){

          ItemService.getItems( ).then( function( items ){

            $scope.items = items;

          }).catch( function( err ){
              console.log( "error = " + err );
          });
        }

        if( $location.path() == "/myItems" ){

            ItemService.getItemsBelongingTo( $scope.user._id ).then( function( items ){
              
              $scope.myItems = items;

            }).catch( function( err ){
              console.log( "error = " + err );
              $scope.myItems = {};
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

    $scope.createItem = function( item ){

      ItemService.createItem( item ).then( function( ){ 
          $location.path("/myItems");
       }, function(){
          alert( "Item not created" );
       })
    }

    $scope.deleteItem = function( ID ){

      ItemService.deleteItem( ID ).then( function( ){ 
          $route.reload();
       }, function(){
          alert( "Item not deleted" );
       })
    }

    $scope.updateItem = function(){

      ItemService.updateItem( $scope.item ).then( function(){

        $location.path("/myItems");

      }, function(){
        alert( "Item not updated" );
      })

    }

    $scope.getOwnerName = function( owner ){
      return owner.local.name ? owner.local.name : owner.google.name ? owner.google.name : owner.facebook.name

    }


}]);