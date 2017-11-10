angular.module('myApp').controller('itemController', [ '$routeParams', 'ItemService', function( $routeParams, ItemService ){
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