angular.module('myApp').controller('exchangeController', [ '$routeParams', '$location', '$scope', 'ItemService', 'AuthService', 'UserService', 'ExchangeService', 'MessageService', 'SocketService', function( $routeParams, $location, $scope, ItemService, AuthService, UserService, ExchangeService, MessageService, SocketService ){
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

    
        //starting a new exchange
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

        //viewing one existing exchange
        if (path.split('/').indexOf('exchange') > -1){

            if( exchangeID ){

                ExchangeService.getExchange( exchangeID ).then( function( exchange ){


                    $scope.exchange = exchange;
                    vm.exchange = exchange;
                    vm.userIsSender = vm.user._id == exchange.sender._id
                    vm.otherUser = vm.userIsSender ? exchange.recipient : exchange.sender

                    initialiseItems();

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


    // Socket events -------------------------------------------------------------------------------------------

    SocketService.on('messages.updated', function( exchange ){

        if( exchange._id == exchangeID ){

            $scope.$apply( function(){
                $scope.exchange.messages = exchange.messages;
            });

        }
    });

    SocketService.on('exchange.updated', function( exchange ){

        if( exchange._id == exchangeID ){

            $scope.$apply( function(){
                $scope.exchange = exchange;
            });

        }
    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });

    


    // Functions for browser use -------------------------------------------------------------------------------------------

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

        //viewing one existing exchange
        if (path.split('/').indexOf('exchange') > -1){

            amendExchange()

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

        //viewing one existing exchange
        if (path.split('/').indexOf('exchange') > -1){

            amendExchange()

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

    vm.sendMessage = function( ){

        var messageToCreate = {

            recipient: vm.otherUser,
            sender: vm.user,
            content: vm.message
        }

        MessageService.createMessage( messageToCreate ).then( function( createdMessage ){ 

            vm.exchange.messages.push( createdMessage.data )

            ExchangeService.addMessageToExchange( vm.exchange ).then( function(){
        
                vm.message = ""

            })

        })

    }

    vm.toggleAcceptance = function(){

        if( $scope.exchange.accepted.recipient && $scope.exchange.accepted.sender ){

            //do something to make everything uneditable

        }

        ExchangeService.amendExchange( $scope.exchange )

    }



    // Private functions -------------------------------------------------------------------------------------------

    var amendExchange = function( ){

        if ( vm.userIsSender ){

            vm.exchange.accepted.recipient = 0

        }else{

            vm.exchange.accepted.sender = 0
        }

        ExchangeService.amendExchange( vm.exchange ).then( function( ){  //should this pass $scope.exchange instead?


        }, function(){
            alert( "Exchange not amended" );
        })

    }

    var initialiseItems = function(){

        vm.options = { 

            sender: [],
            recipient: []
        }

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
    }


}]);