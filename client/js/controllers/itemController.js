angular.module('myApp').controller('itemController', [ '$routeParams', 'ItemService', 'AuthService', function( $routeParams, ItemService, AuthService ){
    var vm = this;
    
    var itemId = $routeParams.id;

    if( itemId ){
      ItemService.getItem( itemId ).then( function( item ){
        vm.singleItem = item;
      });
    }

    ItemService.getItems( ).then( function( items ){
      vm.items = items;
    });

  
    AuthService.getUser( ).then( function( user ){
      ItemService.getItemsBelongingTo( user._id ).then( function( items ){
        vm.myItems = items;

      }).catch( function( err ){
        console.log( "error = " + err );
      });
    });

    


    // vm.item = {}; might break something to leave this out...?

    vm.createItem = function( item ){

      ItemService.createItem( item ).then( function( ){ 
          alert( 'created successfully!!!' ); 
       }, function(){
          alert( 'something bad' );
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