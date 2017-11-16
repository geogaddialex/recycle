angular.module('myApp').controller('itemController', [ '$routeParams', '$location', 'ItemService', 'AuthService', function( $routeParams, $location, ItemService, AuthService ){
    var vm = this;
    
    var itemId = $routeParams.id;

    if( itemId ){
      ItemService.getItem( itemId ).then( function( item ){
        vm.singleItem = item;
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
        });
      });
    }
   


    vm.createItem = function( item ){

      ItemService.createItem( item ).then( function( ){ 
          alert( "Item created successfully" );
          $location.path("/");
       }, function(){
          alert( "Item not created" );
       })
    }




    vm.toggleFilters = function( ){

      if( $( "#menu-toggle:contains('Filter items')" ).length ){

          $('#menu-toggle').html("Hide filters");

      } else {     
          $('#menu-toggle').html("Filter items");
      }

      $("#wrapper").toggleClass("toggled");
    }

}]);