angular.module('myApp').controller('exchangeController', [ '$routeParams', '$location', '$scope', 'ItemService', 'AuthService', 'UserService', 'ExchangeService', function( $routeParams, $location, $scope, ItemService, AuthService, UserService, ExchangeService ){
    var vm = this;
    
    var item = $routeParams.item;
    var username = $routeParams.username;

    vm.exchange = { 

        items: { sender: [], recipient: [] },
        messages: [],
        accepted: { sender: 1, recipient: 0 },
        feedback: []

    }

    if( $location.path() == "/exchanges" ){

      ExchangeService.getExchanges( ).then( function( exchanges ){

        vm.exchanges = exchanges;
      });
    }

    if( $location.path() == "/myExchanges" ){
      AuthService.getUser( ).then( function( user ){
        ExchangeService.getExchangesInvolving( user._id ).then( function( exchanges ){
          vm.myExchanges = exchanges;

        }).catch( function( err ){
          console.log( "error = " + err );
          vm.myExchanges = {};
        });
      });
    }

    vm.options = { myItems: [], otherUserItems: [] }

    AuthService.getUser().then( function(user){
      vm.user = user;
      vm.exchange.sender = user;
    });

    //initialise users dropdown
    UserService.getUsers( ).then( function( users ){
      vm.users = users;

      //initialise otherUser when url specifies one
      if( username ){

        var user = vm.users.find(user => user.username === username);
          vm.otherUser = user
          vm.selectedUser = user
          vm.exchange.recipient = user;

      }
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


    //watch select list for changes

    $scope.$watch( angular.bind( this, function(){
      return vm.selectedUser;
    }), function( selected ){

      if( !selected ){

        vm.options.otherUserItems = [];
        vm.exchange.items.recipient = [];
        vm.exchange.recipient = "";
        vm.otherUser = {username:"No user selected"};

      }else{

        vm.options.otherUserItems = [];
        vm.exchange.items.recipient = [];
            
        vm.otherUser = vm.users.find( user => user.username === selected.username );
        vm.exchange.recipient = vm.users.find( user => user.username === selected.username );

        ItemService.getItemsBelongingTo( vm.otherUser._id ).then( function( items ){

          for( x in items ){
            vm.options.otherUserItems.push( items[x] );
          }

        }).catch( function( err ){
          console.log( "error = " + err );
          vm.otherUser.items = {};
        });  
      }
    });
    

    vm.addToExchange = function( user, item ){

      if( user == 'user' ){

        vm.exchange.items.sender.push( item );
        var optionsArray = vm.options.myItems;

      }else{

        vm.exchange.items.recipient.push( item );
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

    vm.sendOffer = function( exchange ){

      ExchangeService.createExchange( exchange ).then( function( ){ 
          alert( "Offer sent successfully" );
          $location.path("/myExchanges");
       }, function(){
          alert( "Offer not sent" );
       })

    }

}]);