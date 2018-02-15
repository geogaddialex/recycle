angular.module('myApp').controller('exchangeController', [ '$routeParams', '$location', '$scope', 'ItemService', 'AuthService', 'UserService', 'ExchangeService', 'MessageService', 'ConversationService', 'FeedbackService', 'UtilityService', 'SocketService', function( $routeParams, $location, $scope, ItemService, AuthService, UserService, ExchangeService, MessageService, ConversationService, FeedbackService, UtilityService, SocketService ){

    var item = $routeParams.item;
    var userID = $routeParams.user;
    var exchangeID = $routeParams.id;
    var path = $location.path();

    $scope.UtilityService = UtilityService;

    //initialise user
    AuthService.getUser().then( function( user ){
      $scope.user = user;

    
        //starting a new exchange
        if (path.split('/').indexOf('newExchange') > -1){

            $scope.exchange = { 

                sender: $scope.user,
                lastUpdatedBy: $scope.user,
                items: { sender: [], recipient: [] },
                accepted: { sender: true, recipient: false },
            }  

            $scope.options = {
                
                sender: [],
                recipient: []

            }

            //initialise my items 
            ItemService.getItemsBelongingTo( $scope.user._id ).then( function( items ){

                for( x in items ){

                    $scope.options.sender.push( items[x] );
                }

            }).catch( function( err ){

                console.log( "error = " + err );
            });

            //initialise users dropdown
            UserService.getUsers( ).then( function( users ){
                $scope.users = users;

                //initialise otherUser when url specifies one
                if( userID ){

                    var otherUser = $scope.users.find(user => user._id === userID);
                    $scope.otherUser = otherUser
                    $scope.selectedUser = otherUser
                    $scope.exchange.recipient = otherUser;
                }

            })

            //watch select list for changes

            $scope.$watch( angular.bind( this, function(){

                return $scope.selectedUser;

            }), function( selected ){

                if( !selected ){

                    $scope.options.recipient = [];
                    $scope.exchange.items.recipient = [];
                    $scope.exchange.recipient = "";

                } else {

                    $scope.options.recipient = [];
                    $scope.exchange.items.recipient = [];

                    $scope.otherUser = $scope.users.find( user => user._id === selected._id );
                    $scope.exchange.recipient = $scope.otherUser

                    ItemService.getItemsBelongingTo( $scope.otherUser._id ).then( function( items ){

                        for( x in items ){
                            $scope.options.recipient.push( items[x] );
                        }

                    }).catch( function( err ){

                        console.log( "error = " + err );
                    });  
                }
            });

        }

        // viewing all exchanges (admin functionality) --------------------------------
        if( path == "/exchanges" ){

            ExchangeService.getExchanges( ).then( function( exchanges ){

                $scope.exchanges = exchanges;

            }).catch( function( err ){
                console.log( "error = " + err );
            });
        }

        // viewing my exchanges ------------------------------------------------
        if( path == "/myExchanges" ){

            ExchangeService.getExchangesInvolving( $scope.user._id ).then( function( exchanges ){

                $scope.myExchanges = exchanges;

            }).catch( function( err ){
                
                console.log( "error = " + err );
                $scope.myExchanges = {};

            });
        }


        // viewing one existing exchange --------------------------------------- 
        if (path.split('/').indexOf('exchange') > -1){

            if( exchangeID ){

                ExchangeService.getExchange( exchangeID ).then( function( exchange ){

                    $scope.exchange = exchange;

                    $scope.userIsSender = $scope.user._id == exchange.sender._id
                    $scope.otherUser = $scope.userIsSender ? exchange.recipient : exchange.sender

                    updateOptions()
                    updateConversation( )

                    FeedbackService.getFeedbackRegarding( $scope.otherUser._id ).then( function( feedbacks ){

                        console.log(JSON.stringify( feedbacks ))

                        $scope.otherUserFeedbacks = feedbacks

                    })

                }).catch( function( err ){
                    console.log( "couldn't get exchange = " + err );
                });
            }
        }


    });


    // Socket events ----------------------------------------------------------------------------------------------------


    SocketService.on('exchange.updated', function( exchange ){

        if( exchange._id == exchangeID ){

            $scope.$applyAsync( function(){

                $scope.exchange = exchange;  

                updateConversation( )
              
            });
            
            updateOptions()

        }
    });

    SocketService.on('conversation.updated', function( conversation ){

        if( conversation._id == $scope.exchange.conversation._id ){

                $scope.$applyAsync( function(){

                    $scope.exchange.conversation = conversation;
                  
                });
                
        }
    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });

    


    // Functions for browser use -------------------------------------------------------------------------------------------


    $scope.sendOffer = function( exchange ){


        var conversationToCreate = {

            users: [ exchange.sender, exchange.recipient ]
        }

        ConversationService.createConversation( conversationToCreate ).then(function( createdConversation ){

            exchange.conversation = createdConversation.data;

            ExchangeService.createExchange( exchange ).then( function( ){ 

                alert( "Offer sent successfully" );
                $location.path("/myExchanges");

            }, function(){
                alert( "Offer not sent" );
            })

        })

       

    }

    $scope.addToExchange = function( itemToAdd ){

        var recipientHasIt = $scope.options.recipient.find(item => item._id === itemToAdd._id)
        var senderHasIt = $scope.options.sender.find(item => item._id === itemToAdd._id)

        if( senderHasIt ){

            var array = $scope.options.sender
            array.splice( array.indexOf(senderHasIt), 1 ) 

            $scope.exchange.items.sender.push( itemToAdd );

        }else if( recipientHasIt ){

            var array = $scope.options.recipient
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

    $scope.removeFromExchange = function( itemToRemove ){

        var recipientHasIt = $scope.exchange.items.recipient.find(item => item._id === itemToRemove._id)
        var senderHasIt = $scope.exchange.items.sender.find(item => item._id === itemToRemove._id)

        if( senderHasIt ){

            var array = $scope.exchange.items.sender
            array.splice( array.indexOf(senderHasIt), 1 ) 

            $scope.options.sender.push( itemToRemove );
            

        }else if( recipientHasIt) {

            var array = $scope.exchange.items.recipient
            array.splice( array.indexOf(recipientHasIt), 1 ) 

            $scope.options.recipient.push( itemToRemove );

        } else{

            console.log("cant find item: " + itemToRemove )

        } 

        //viewing one existing exchange
        if (path.split('/').indexOf('exchange') > -1){

            $scope.exchange.accepted = { sender: 0, recipient: 0 };
            amendExchange()

        }

    }


    $scope.sendMessage = function( ){

        var messageToCreate = {

            sender: $scope.user,
            content: $scope.message
        }

        MessageService.createMessage( messageToCreate ).then( function( createdMessage ){ 

            $scope.exchange.conversation.messages.push( createdMessage.data )

            $scope.message = ""
            amendConversation()

        })

    }

    $scope.toggleAcceptance = function(){

        if( $scope.exchange.accepted.recipient && $scope.exchange.accepted.sender ){

            $scope.exchange.status = "Agreed"

        }

        amendExchange()

    }

    $scope.cancelExchange = function(){

        $scope.exchange.status = "Cancelled"

        amendExchange()

    }


    // Private functions -------------------------------------------------------------------------------------------

    var amendExchange = function( ){

        $scope.exchange.lastUpdatedBy = $scope.user
        $scope.exchange.lastModified = Date.now()

        ExchangeService.amendExchange( $scope.exchange ).then( function( ){


        }, function(){
            alert( "Exchange not amended" );
        })

    }

    var amendConversation = function( ){

        ConversationService.updateConversation( $scope.exchange.conversation ).then( function( ){


        }, function(){
            alert( "Exchange not amended" );
        })

    }

    var updateConversation = function( ){

        ConversationService.getConversation( $scope.exchange.conversation._id ).then( function( retrievedConversation ){

            $scope.exchange.conversation = retrievedConversation

        }).catch( function( err ){
            console.log( "couldn't get conversation = " + err );
        })

    }

    var updateOptions = function(){

        $scope.options = { 

            sender: [],
            recipient: []
        }

        //initialise my items 
        ItemService.getItemsBelongingTo( $scope.user._id ).then( function( items ){

            for( x in items ){

                var recipientHasIt = $scope.exchange.items.recipient.find(item => item._id === items[x]._id)
                var senderHasIt = $scope.exchange.items.sender.find(item => item._id === items[x]._id)

                if( !recipientHasIt && !senderHasIt ){

                    if($scope.userIsSender){

                        $scope.options.sender.push( items[x] );
                    }else{

                        $scope.options.recipient.push( items[x] );                                    
                    }

                }
            }

        }).catch( function( err ){

            console.log( "error = " + err );
        });

        //initialise other users items
        ItemService.getItemsBelongingTo( $scope.otherUser._id ).then( function( items ){

            for( x in items ){

                var recipientHasIt = $scope.exchange.items.recipient.find(item => item._id === items[x]._id)
                var senderHasIt = $scope.exchange.items.sender.find(item => item._id === items[x]._id)

                //add item to options array as long as its not already part of the exchange
                if( !recipientHasIt && !senderHasIt ){

                    if($scope.userIsSender){

                        $scope.options.recipient.push( items[x] );
                    }else{

                        $scope.options.sender.push( items[x] );                                    
                    }

                }
            }

        }).catch( function( err ){

            console.log( "error = " + err );
        });  
    }


}]);