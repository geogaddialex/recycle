angular.module('myApp').controller('exchangeController', [ '$routeParams', '$location', '$scope', 'ItemService', 'AuthService', 'UserService', 'ExchangeService', function( $routeParams, $location, $scope, ItemService, AuthService, UserService, ExchangeService ){
    var vm = this;

    var item = $routeParams.item;
    var username = $routeParams.username;
    var exchangeID = $routeParams.id;

    var path = $location.path();

    vm.options = { 

        sender: [],
        recipient: []
    }

    //initialise user
    AuthService.getUser().then( function( user ){
      vm.user = user;

    
        //when initialising a new exchange

        if (path.split('/').indexOf('newExchange') > -1){

            vm.exchange = { 

                sender: vm.user,
                items: { sender: [], recipient: [] },
                messages: [],
                accepted: { sender: 1, recipient: 0 },
                feedback: []

            }  

            //initialise my items 
            ItemService.getItemsBelongingTo( vm.user._id ).then( function( items ){

                for( x in items ){

                    vm.options.sender.push( items[x] );
                }

            }).catch( function( err ){

                console.log( "error = " + err );
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

            //watch select list for changes

            $scope.$watch( angular.bind( this, function(){

                return vm.selectedUser;

            }), function( selected ){

                if( !selected ){

                    vm.options.recipient = [];
                    vm.exchange.items.recipient = [];
                    vm.exchange.recipient = "";
                    vm.otherUser = {username:"No user selected"};

                } else {

                    vm.options.recipient = [];
                    vm.exchange.items.recipient = [];

                    vm.otherUser = vm.users.find( user => user.username === selected.username );
                    vm.exchange.recipient = vm.users.find( user => user.username === selected.username );

                    ItemService.getItemsBelongingTo( vm.otherUser._id ).then( function( items ){

                        for( x in items ){
                            vm.options.recipient.push( items[x] );
                        }

                    }).catch( function( err ){

                        console.log( "error = " + err );
                    });  
                }
            });

        }

        //when on one exchange
        if (path.split('/').indexOf('exchange') > -1){

            if( exchangeID ){

                ExchangeService.getExchange( exchangeID ).then( function( exchange ){

                    vm.exchange = exchange;
                    vm.userIsSender = vm.user._id == exchange.sender._id
                    vm.otherUser = vm.userIsSender ? exchange.recipient : exchange.sender

                    //initialise my items 
                    ItemService.getItemsBelongingTo( vm.user._id ).then( function( items ){

                        for( x in items ){

                            var recipientHasIt = vm.exchange.items.recipient.find(item => item._id === items[x]._id)
                            var senderHasIt = vm.exchange.items.sender.find(item => item._id === items[x]._id)

                            if( !recipientHasIt && !senderHasIt ){

                                if(vm.userIsSender){

                                    vm.options.sender.push( items[x] );
                                }else{

                                    vm.options.recipient.push( items[x] );                                    
                                }

                            }
                        }

                    }).catch( function( err ){

                        console.log( "error = " + err );
                    });

                    //initialise other users items
                    ItemService.getItemsBelongingTo( vm.otherUser._id ).then( function( items ){

                        for( x in items ){

                            var recipientHasIt = vm.exchange.items.recipient.find(item => item._id === items[x]._id)
                            var senderHasIt = vm.exchange.items.sender.find(item => item._id === items[x]._id)

                            //add item to options array as long as its not already part of the exchange
                            if( !recipientHasIt && !senderHasIt ){

                                if(vm.userIsSender){

                                    vm.options.recipient.push( items[x] );
                                }else{

                                    vm.options.sender.push( items[x] );                                    
                                }

                            }
                        }

                    }).catch( function( err ){

                        console.log( "error = " + err );
                    });  



                }).catch( function( err ){
                    console.log( "error = " + err );
                });
            }
        }

        //viewing all exchanges (admin functionality)
        if( $location.path() == "/exchanges" ){

            ExchangeService.getExchanges( ).then( function( exchanges ){

                vm.exchanges = exchanges;

            }).catch( function( err ){
                console.log( "error = " + err );
            });
        }

        //viewing my exchanges
        if( $location.path() == "/myExchanges" ){

            ExchangeService.getExchangesInvolving( vm.user._id ).then( function( exchanges ){
                
                vm.myExchanges = exchanges;

            }).catch( function( err ){
                
                console.log( "error = " + err );
                vm.myExchanges = {};

            });
        }

    });

    

    vm.addToExchange = function( itemToAdd ){

        var recipientHasIt = vm.options.recipient.find(item => item._id === itemToAdd._id)
        var senderHasIt = vm.options.sender.find(item => item._id === itemToAdd._id)

        if( senderHasIt ){

            var array = vm.options.sender
            array.splice( array.indexOf(senderHasIt), 1 ) 

            vm.exchange.items.sender.push( itemToAdd );

        }else if( recipientHasIt ){

            var array = vm.options.recipient
            array.splice( array.indexOf(recipientHasIt), 1 ) 

            vm.exchange.items.recipient.push( itemToAdd );

        }else{

            console.log("cant find item: " + itemToRemove )

        }

    }

    vm.removeFromExchange = function( itemToRemove ){

        var recipientHasIt = vm.exchange.items.recipient.find(item => item._id === itemToRemove._id)
        var senderHasIt = vm.exchange.items.sender.find(item => item._id === itemToRemove._id)

        if( senderHasIt ){

            var array = vm.exchange.items.sender
            array.splice( array.indexOf(senderHasIt), 1 ) 

            vm.options.sender.push( itemToRemove );
            

        }else if( recipientHasIt) {

            var array = vm.exchange.items.recipient
            array.splice( array.indexOf(recipientHasIt), 1 ) 

            vm.options.recipient.push( itemToRemove );

        } else{

            console.log("cant find item: " + itemToRemove )

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