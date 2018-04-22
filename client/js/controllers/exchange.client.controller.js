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
                status: "In progress"
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

                    }, function( err ){

                        setError( "Could not get recipient's items" )

                    });  
                }
            });

        }


        // viewing my exchanges ------------------------------------------------
        if( path == "/myExchanges" ){

            ExchangeService.getExchangesInvolving( $scope.user._id ).then( function( exchanges ){

                $scope.myExchanges = exchanges;

            }, function( err ){
                
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
                    $scope.viewerIsParty = $scope.user._id == exchange.sender._id || $scope.user._id == exchange.recipient._id

                    updateOptions()
                    updateConversation( )

                    $scope.feedback = {

                        rating: null,
                        comment: null,
                        author: $scope.user,
                        subject: $scope.otherUser,
                        exchangeHappened: null
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

                }, function( err ){

                    setError( "Could not get exchange" )

                });
            }
        }


    }, function(){

        setError( "Could not get logged in user" )

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

        if( !exchange.recipient ){

            setError( "Please select a user to send the offer to" )

        }else if( exchange.items.recipient.length < 1 && exchange.items.sender.length < 1 ){

            setError( "At least one item must be selected to send an offer (you can request or offer an item for nothing in return)" )

        }else{

            ngDialog.openConfirm({ 

                template: '/partials/dialog_create_exchange.html'

            }).then(function (success) {

                ConversationService.createConversation( ).then(function( createdConversation ){

                    exchange.conversation = createdConversation.data.conversation;

                    ExchangeService.createExchange( exchange ).then( function( exchange ){ 

                        $location.path("/exchange/"+exchange.data.exchange._id);

                    }, function(){
                        
                        setError( "Could not send offer" )

                    })

                }, function(){

                    setError( "Could not send offer" )

                })

            }, function(error){

            })

        }

        
 

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

            setError( "Could not add item" )


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
            

        }else if( recipientHasIt) {

            var array = $scope.exchange.items.recipient
            array.splice( array.indexOf(recipientHasIt), 1 ) 


        } else{

            setError( "Could not remove item" )

        } 

        //viewing one existing exchange
        if (path.split('/').indexOf('exchange') > -1){

            $scope.exchange.accepted = { sender: 0, recipient: 0 };
            amendExchange()

        }else{

            senderHasIt ? $scope.options.sender.push( itemToRemove ) : $scope.options.recipient.push( itemToRemove )

        }

    }


    $scope.sendMessage = function( ){

        clearError()

        if( !UtilityService.isValidMessage( $scope.message.text ) ){

            setError("Please enter a message between 1 and 500 characters long")

        }else if( !UtilityService.isSanitary( $scope.message.text ) ){

            setError("The message can only contain letters, numbers, spaces and - / _ £ ? : . ,")

        }else{

            var messageToCreate = {

                sender: $scope.user,
                content: $scope.message.text
            }

            MessageService.createMessage( messageToCreate ).then( function( createdMessage ){ 

                $scope.exchange.conversation.messages.push( createdMessage.data.message )

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

            UserService.getUser( $scope.exchange.recipient._id ).then( function( user ){

                user.completedExchanges += 1
                UserService.updateUser( user )

            })


            UserService.getUser( $scope.exchange.sender._id ).then( function( user ){

                user.completedExchanges += 1
                UserService.updateUser( user )

            })

        }

        amendExchange()

    }

    // $scope.cancelExchange = function(){

    //     clearError()

    //     $scope.exchange.status = "Cancelled"

    //     amendExchange()

    // }

    $scope.cancelExchange = function( ID ){

        clearError()

        ExchangeService.getExchange( ID ).then( function( exchange ){

            exchange.status = "Cancelled"
            exchange.lastUpdatedBy = $scope.user

            ExchangeService.amendExchange( exchange ).then( function(){


            }, function(){

                setError( "Could not cancel exchange" )
            })

        }, function(){

            setError( "Could not cancel exchange" )
        })
    }

    $scope.submitFeedback = function( ){

        clearError()

        if( !$scope.feedback.rating ){

            setError( "Please enter a comment that is 1-140 characters long" )

        }else if( !UtilityService.isValidFeedbackMessage( $scope.feedback.comment )){

            setError( "Please enter a comment that is 1-140 characters long" )
        
        }else if( !UtilityService.isSanitary( $scope.feedback.comment )){

            setError( "The comment can only contain letters, numbers, spaces and - / _ £ ? : . ," )
        
        }else if( !$scope.feedback.exchangeHappened ){

            setError( "Please tell us whether the exchange actually took place" )
        
        }else{
            FeedbackService.createFeedback( $scope.feedback ).then( function( createdFeedback ){ 

                if( $scope.userIsSender ){

                    $scope.exchange.feedback.sender = createdFeedback.data.feedback

                }else{

                    $scope.exchange.feedback.recipient = createdFeedback.data.feedback
                }

                amendExchange()
                updateFeedbackScore()

                if( $scope.feedback.exchangeHappened === "true" ){

                    console.log( "did exchange happen? - " + $scope.feedback.exchangeHappened)

                    removeSwappedItems( $scope.exchange, $scope.userIsSender )
                }

                $scope.feedbackSubmitted = createdFeedback.data.feedback

                createdFeedback.data.feedback.author = $scope.user
                $scope.otherUserFeedbacks.push( createdFeedback.data.feedback )


            }, function(){

                setError( "Could not submit feedback" )

            })

        }

        

    }

    $scope.showAllFeedback = function( user ){

        $location.path( '/users/'+user._id+'/feedback' )
    }

    $scope.showInfo = function( item ){

        ngDialog.open({ 

          template: '/partials/dialog_item_details.html',
          controller: 'itemDetailsController',
          data: { item: item, user: $scope.user }
          
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

        }, function( err ){

            setError( "Could not send message" )
        })

    }

    var updateFeedbackScore = function( ){

        clearError()

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

        }, function( err ){

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

        }, function( err ){

            setError( "Could not get items" )
        });  
    }

    var removeSwappedItems = function( exchange, userIsSender ){


        var items = userIsSender ? exchange.items.sender : exchange.items.recipient

        for(var x=0; x<items.length; x++){

            var item = items[x]

            if(item){

                item.removed = true
                
                ItemService.updateItem( item ).then(function(){


                }, function(){

                    console.log( "couldn't remove " + item.name )

                })

            }

            

        }

    }
    
    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }


});