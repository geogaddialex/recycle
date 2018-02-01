angular.module('myApp').controller('exchangeController', [ '$routeParams', '$location', '$scope', 'ItemService', 'AuthService', 'UserService', 'ExchangeService', 'MessageService', 'SocketService', function( $routeParams, $location, $scope, ItemService, AuthService, UserService, ExchangeService, MessageService, SocketService ){
    var vm = this;

    var item = $routeParams.item;
    var username = $routeParams.username;
    var exchangeID = $routeParams.id;

    var path = $location.path();

    //initialise user
    AuthService.getUser().then( function( user ){
      vm.user = user;

    
        //starting a new exchange
        if (path.split('/').indexOf('newExchange') > -1){

            $scope.exchange = { 

                sender: vm.user,
                lastUpdatedBy: vm.user,
                items: { sender: [], recipient: [] },
                messages: [],
                accepted: { sender: 1, recipient: 0 },
                feedback: []

            }  

            vm.options = {
                
                sender: [],
                recipient: []

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
                    $scope.exchange.recipient = user;
                }

            })

            //watch select list for changes

            $scope.$watch( angular.bind( this, function(){

                return vm.selectedUser;

            }), function( selected ){

                if( !selected ){

                    vm.options.recipient = [];
                    $scope.exchange.items.recipient = [];
                    $scope.exchange.recipient = "";
                    vm.otherUser = {username:"No user selected"};

                } else {

                    vm.options.recipient = [];
                    $scope.exchange.items.recipient = [];

                    vm.otherUser = vm.users.find( user => user.username === selected.username );
                    $scope.exchange.recipient = vm.users.find( user => user.username === selected.username );

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

        // viewing all exchanges (admin functionality) --------------------------------
        if( $location.path() == "/exchanges" ){

            ExchangeService.getExchanges( ).then( function( exchanges ){

                vm.exchanges = exchanges;

            }).catch( function( err ){
                console.log( "error = " + err );
            });
        }

        // viewing my exchanges ------------------------------------------------
        if( $location.path() == "/myExchanges" ){

            ExchangeService.getExchangesInvolving( vm.user._id ).then( function( exchanges ){
                
                vm.myExchanges = exchanges;

            }).catch( function( err ){
                
                console.log( "error = " + err );
                vm.myExchanges = {};

            });
        }


        // viewing one existing exchange --------------------------------------- 
        if (path.split('/').indexOf('exchange') > -1){

            if( exchangeID ){

                ExchangeService.getExchange( exchangeID ).then( function( exchange ){


                    $scope.exchange = exchange;
                    vm.userIsSender = vm.user._id == exchange.sender._id
                    vm.otherUser = vm.userIsSender ? exchange.recipient : exchange.sender

                    updateOptions()

                }).catch( function( err ){
                    console.log( "error = " + err );
                });
            }
        }


    });


    // Socket events ----------------------------------------------------------------------------------------------------


    SocketService.on('exchange.updated', function( exchange ){

        if( exchange._id == exchangeID ){

                $scope.$applyAsync( function(){

                    $scope.exchange = exchange;                    
                });
                
                updateOptions()

        }
    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });

    


    // Functions for browser use -------------------------------------------------------------------------------------------


    vm.sendOffer = function( exchange ){

        ExchangeService.createExchange( exchange ).then( function( ){ 

            alert( "Offer sent successfully" );
            $location.path("/myExchanges");

        }, function(){
            alert( "Offer not sent" );
        })

    }

    vm.addToExchange = function( itemToAdd ){

        var recipientHasIt = vm.options.recipient.find(item => item._id === itemToAdd._id)
        var senderHasIt = vm.options.sender.find(item => item._id === itemToAdd._id)

        if( senderHasIt ){

            var array = vm.options.sender
            array.splice( array.indexOf(senderHasIt), 1 ) 

            $scope.exchange.items.sender.push( itemToAdd );

        }else if( recipientHasIt ){

            var array = vm.options.recipient
            array.splice( array.indexOf(recipientHasIt), 1 ) 

            $scope.exchange.items.recipient.push( itemToAdd );

        }else{

            console.log("cant find item: " + itemToRemove )

        }

        //viewing one existing exchange
        if (path.split('/').indexOf('exchange') > -1){

            $scope.exchange.accepted = { sender: 0, recipient: 0 };
            amendExchange()

        }

    }

    vm.removeFromExchange = function( itemToRemove ){

        var recipientHasIt = $scope.exchange.items.recipient.find(item => item._id === itemToRemove._id)
        var senderHasIt = $scope.exchange.items.sender.find(item => item._id === itemToRemove._id)

        if( senderHasIt ){

            var array = $scope.exchange.items.sender
            array.splice( array.indexOf(senderHasIt), 1 ) 

            vm.options.sender.push( itemToRemove );
            

        }else if( recipientHasIt) {

            var array = $scope.exchange.items.recipient
            array.splice( array.indexOf(recipientHasIt), 1 ) 

            vm.options.recipient.push( itemToRemove );

        } else{

            console.log("cant find item: " + itemToRemove )

        } 

        //viewing one existing exchange
        if (path.split('/').indexOf('exchange') > -1){

            $scope.exchange.accepted = { sender: 0, recipient: 0 };
            amendExchange()

        }

    }


    vm.sendMessage = function( ){

        var messageToCreate = {

            recipient: vm.otherUser,
            sender: vm.user,
            content: $scope.message
        }

        MessageService.createMessage( messageToCreate ).then( function( createdMessage ){ 

            $scope.exchange.messages.push( createdMessage.data )
            amendExchange()

        })

    }

    vm.toggleAcceptance = function(){

        if( $scope.exchange.accepted.recipient && $scope.exchange.accepted.sender ){

            $scope.exchange.status = "Agreed"

        }

        amendExchange()

    }

    vm.cancelExchange = function(){

        $scope.exchange.status = "Cancelled"

        amendExchange()

    }



    // Private functions -------------------------------------------------------------------------------------------

    var amendExchange = function( ){

        $scope.exchange.lastUpdatedBy = vm.user
        $scope.exchange.lastModified = Date.now()

        ExchangeService.amendExchange( $scope.exchange ).then( function( ){


        }, function(){
            alert( "Exchange not amended" );
        })

    }

    var updateOptions = function(){

        vm.options = { 

            sender: [],
            recipient: []
        }

        //initialise my items 
        ItemService.getItemsBelongingTo( vm.user._id ).then( function( items ){

            for( x in items ){

                var recipientHasIt = $scope.exchange.items.recipient.find(item => item._id === items[x]._id)
                var senderHasIt = $scope.exchange.items.sender.find(item => item._id === items[x]._id)

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

                var recipientHasIt = $scope.exchange.items.recipient.find(item => item._id === items[x]._id)
                var senderHasIt = $scope.exchange.items.sender.find(item => item._id === items[x]._id)

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