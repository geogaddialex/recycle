angular.module('myApp').controller('exchangeController', function( $routeParams, $location, $scope, ngDialog, ItemService, AuthService, UserService, ExchangeService, MessageService, ConversationService, FeedbackService, UtilityService, SocketService ){

    var item = $routeParams.item;
    var userID = $routeParams.user;
    var exchangeID = $routeParams.id;
    var path = $location.path();
    $scope.error = {}
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

                setError( "Could not get items" )
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

            }, function(){

                setError( "Could not get users" )

            })

            //watch select list for changes

            $scope.$watch( angular.bind( this, function(){

                return $scope.selectedUser;

            }), function( selected ){

                clearError()

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

                        setError( "Could not get recipient's items" )

                    });  
                }
            });

        }

        // viewing all exchanges (admin functionality) --------------------------------
        if( path == "/exchanges" ){

            ExchangeService.getExchanges( ).then( function( exchanges ){

                $scope.exchanges = exchanges;

            }).catch( function( err ){

                setError( "Could not get exchanges" )

            });
        }

        // viewing my exchanges ------------------------------------------------
        if( path == "/myExchanges" ){

            ExchangeService.getExchangesInvolving( $scope.user._id ).then( function( exchanges ){

                $scope.myExchanges = exchanges;

            }).catch( function( err ){
                
                setError( "Could not get exchanges" )

            });
        }


        // viewing one existing exchange --------------------------------------- 
        if (path.split('/').indexOf('exchange') > -1){

            if( exchangeID ){

                ExchangeService.getExchange( exchangeID ).then( function( exchange ){

                    $scope.message = { text: "" }
                    $scope.exchange = exchange
                    $scope.userIsSender = $scope.user._id == exchange.sender._id
                    $scope.otherUser = $scope.userIsSender ? exchange.recipient : exchange.sender

                    if( exchange.status == "In progress"){

                        $scope.showDiv = "negotiate"
                    }else if( exchange.status == "Agreed" ){

                        $scope.showDiv = "swap"
                    }else if( exchange.status == "Completed" ){

                        $scope.showDiv = "feedback"
                    }

                    updateOptions()
                    updateConversation( )

                    $scope.feedback = {

                        rating: null,
                        comment: null,
                        author: $scope.user,
                        subject: $scope.otherUser
                    }

                    if( $scope.userIsSender ){

                        $scope.feedbackSubmitted = exchange.feedback.sender
                    }else{
                        $scope.feedbackSubmitted = exchange.feedback.recipient

                    }


                    FeedbackService.getFeedbackRegarding( $scope.otherUser._id ).then( function( feedback ){

                        $scope.otherUserFeedbacks = feedback

                    }, function(){

                        setError( "Could not get feedback" )

                    })

                }).catch( function( err ){

                    setError( "Could not get exchange" )

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
        
        clearError()

        ngDialog.openConfirm({ 

            template: '/partials/dialog_create_exchange.html'

        }).then(function (success) {

            var conversationToCreate = {

                users: [ exchange.sender, exchange.recipient ]
            }

            ConversationService.createConversation( conversationToCreate ).then(function( createdConversation ){

                exchange.conversation = createdConversation.data;

                ExchangeService.createExchange( exchange ).then( function( ){ 

                    $location.path("/myExchanges");

                }, function(){
                    
                    setError( "Could not send offer" )

                })

            }, function(){

                setError( "Could not send offer" )

            })

        }, function(error){

        })
 

    }

    $scope.addToExchange = function( itemToAdd ){

        clearError()

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

            setError( "Could not remove item" )


        }

        //viewing one existing exchange
        if (path.split('/').indexOf('exchange') > -1){

            $scope.exchange.accepted = { sender: 0, recipient: 0 };
            amendExchange()

        }

    }

    $scope.removeFromExchange = function( itemToRemove ){

        clearError()

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

            setError( "Could not remove item" )

        } 

        //viewing one existing exchange
        if (path.split('/').indexOf('exchange') > -1){

            $scope.exchange.accepted = { sender: 0, recipient: 0 };
            amendExchange()

        }

    }


    $scope.sendMessage = function( ){

        clearError()

        if( !UtilityService.isValidMessage( $scope.message.text ) ){

            setError("Messages cannot be empty")

        }else{

            var messageToCreate = {

                sender: $scope.user,
                content: $scope.message.text
            }

            MessageService.createMessage( messageToCreate ).then( function( createdMessage ){ 

                $scope.exchange.conversation.messages.push( createdMessage.data )

                $scope.message = { text: "" }
                amendConversation()

            }, function(){

                setError("Cannot send message")

            })

        }

    }

    $scope.toggleAcceptance = function(){

        clearError()

        if( $scope.exchange.accepted.recipient && $scope.exchange.accepted.sender ){

            $scope.exchange.status = "Agreed"

        }

        amendExchange()

    }

    $scope.cancelExchange = function(){

        clearError()

        $scope.exchange.status = "Cancelled"

        amendExchange()

    }

    $scope.cancelExchange = function( ID ){

        clearError()

        ExchangeService.getExchange( ID ).then( function( exchange ){

            exchange.status = "Cancelled"
            exchange.lastUpdatedBy = $scope.user

            ExchangeService.amendExchange( exchange ).then( function(){


            }, function(){

                setError( "Could not cancel exchange" )
            })

        })
    }

    $scope.submitFeedback = function( ){

        clearError()

        FeedbackService.createFeedback( $scope.feedback ).then( function( createdFeedback ){ 

            if( $scope.userIsSender ){

                $scope.exchange.feedback.sender = createdFeedback.data

            }else{

                $scope.exchange.feedback.recipient = createdFeedback.data
            }

            amendExchange()
            updateFeedbackScore()

            $scope.feedbackSubmitted = createdFeedback.data

            createdFeedback.data.author = $scope.user
            $scope.otherUserFeedbacks.push( createdFeedback.data )


        }, function(){

            setError( "Could not submit feedback" )

        })

    }


    // Private functions -------------------------------------------------------------------------------------------

    var amendExchange = function( ){

        clearError()

        $scope.exchange.lastUpdatedBy = $scope.user
        $scope.exchange.lastModified = Date.now()

        ExchangeService.amendExchange( $scope.exchange ).then( function( ){


        }, function(){               

            setError( "Could not update exchange" )

        })

    }

    var amendConversation = function( ){

        clearError()

        ConversationService.updateConversation( $scope.exchange.conversation ).then( function( ){


        }, function(){

            setError( "Could not send message" )
        })

    }

    var updateConversation = function( ){

        clearError()

        ConversationService.getConversation( $scope.exchange.conversation._id ).then( function( retrievedConversation ){

            $scope.exchange.conversation = retrievedConversation

        }).catch( function( err ){

            setError( "Could not send message" )
        })

    }

    var updateFeedbackScore = function( ){

        clearError()

        // UserService.getUser( $scope.otherUser._id ).then(function( user ){

        //     user.feedback.count += 1
        //     user.feedback.total = parseFloat( $scope.feedback.rating ) + parseFloat( user.feedback.total )
        //     user.feedback.score = +((user.feedback.total/user.feedback.count*50).toFixed(2));

        //     UserService.updateUser( user ).then(function(){


        //     }, function(){

        //         setError( "Could not update feedback score" )
        //     })

        // })


        $scope.otherUser.feedback.count += 1
        $scope.otherUser.feedback.total = parseFloat( $scope.feedback.rating ) + parseFloat( $scope.otherUser.feedback.total )
        $scope.otherUser.feedback.score = +(($scope.otherUser.feedback.total/$scope.otherUser.feedback.count*50).toFixed(2));

        UserService.updateUser( $scope.otherUser ).then(function(){


        }, function(){

            setError( "Could not update feedback score" )
        })

    }

    var updateOptions = function(){

        clearError()

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

            setError( "Could not get items" )
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

            setError( "Could not get items" )
        });  
    }

    
    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }


});