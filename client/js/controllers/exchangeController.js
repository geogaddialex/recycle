angular.module('myApp').controller('exchangeController', [ '$routeParams', '$location', '$scope', 'ItemService', 'AuthService', 'UserService', function( $routeParams, $location, $scope, ItemService, AuthService, UserService ){
    var vm = this;
    
    // vm.selectedUser = {};
    var item = $routeParams.item;
    var username = $routeParams.username;
    vm.exchange = { myItems: [], otherUserItems: [] }
    vm.options = { myItems: [], otherUserItems: [] }


    AuthService.getUser().then( function(user){
      vm.user = user;
    });
    


    //initialise otherUser when url specifies one

    if( username ){
      UserService.getUserByName( username ).then( function( otherUser ){
          
          vm.otherUser = otherUser;
          vm.selectedUser = otherUser;

      }).catch(function( err ){
        console.log("err: " + err)
      });
    }

    //watch select list for changes

    $scope.$watch( angular.bind( this, function( ){
      return vm.selectedUser;
    }), function( selected ){

      if( !selected ){

        vm.options.otherUserItems = [];
        vm.exchange.otherUserItems = [];
        vm.otherUser = {username:"No user selected"};

      }else{

        vm.options.otherUserItems = [];
        vm.exchange.otherUserItems = [];

        UserService.getUserByName( selected.username ).then( function( otherUser ){
            
          vm.otherUser = otherUser;

          ItemService.getItemsBelongingTo( vm.otherUser._id ).then( function( items ){

            for( x in items ){
              vm.options.otherUserItems.push( items[x] );
            }

          }).catch( function( err ){
            console.log( "error = " + err );
            vm.otherUser.items = {};
          });  

        }).catch(function( err ){
          console.log("err: " + err)
        });
      }
    });

    //initialise users dropdown

    UserService.getUsers( ).then( function( users ){
      vm.users = users;
    })
    

    //initialise my items 

    AuthService.getUser( ).then( function( user ){
      vm.user = user;

      ItemService.getItemsBelongingTo( vm.user._id ).then( function( items ){

        for( x in items ){
            vm.options.myItems.push( items[x] );
        }

      }).catch( function( err ){
        console.log( "error = " + err );
        vm.myItems = {};
      });
    });




    vm.addToExchange = function( user, item ){

      if( user == 'user' ){

        vm.exchange.myItems.push( item );
        var optionsArray = vm.options.myItems;

      }else{

        vm.exchange.otherUserItems.push( item );
        var optionsArray = vm.options.otherUserItems;
      }

      var index = optionsArray.indexOf( item );
      if( index > -1 ){
        optionsArray.splice( index, 1 );
      }

    }

    vm.removeFromExchange = function( user, item ){

      if( user == 'user' ){
        vm.options.myItems.push( item );
        var array = vm.exchange.myItems;
      }else{
        vm.options.otherUserItems.push( item );
        var array = vm.exchange.otherUserItems;
      }    

      var index = array.indexOf( item );
      if( index > -1 ){
        array.splice( index, 1 );
      }

    }

}]);