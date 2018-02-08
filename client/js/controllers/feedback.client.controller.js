angular.module('myApp').controller('feedbackController', [ '$routeParams', '$location', '$scope', 'ItemService', 'AuthService', 'UserService', 'ExchangeService', 'MessageService', 'FeedbackService', 'UtilityService', 'SocketService', function( $routeParams, $location, $scope, ItemService, AuthService, UserService, ExchangeService, MessageService, FeedbackService, UtilityService, SocketService ){

    var exchangeID = $routeParams.id;
    var path = $location.path();
    $scope.UtilityService = UtilityService

    //initialise user
    AuthService.getUser().then( function( user ){
      $scope.user = user;


        // viewing one existing exchange --------------------------------------- 
        if (path.split('/').indexOf('feedback') > -1){

            if( exchangeID ){

                ExchangeService.getExchange( exchangeID ).then( function( exchange ){

                    $scope.userIsSender = $scope.user._id == exchange.sender._id
                    $scope.otherUser = $scope.userIsSender ? exchange.recipient : exchange.sender
                    $scope.exchange = exchange;

                    $scope.feedback = {

                        rating: null,
                        comment: null,
                        author: $scope.user
                    }

                    if( $scope.userIsSender ){
                        $scope.feedbackSubmitted = exchange.feedback.sender
                    }else{
                        $scope.feedbackSubmitted = exchange.feedback.recipient

                    }
                    

                }).catch( function( err ){
                    console.log( "error = " + err );
                });
            }
        }


    });


    // Socket events ----------------------------------------------------------------------------------------------------


    SocketService.on('feedback.added', function( exchange ){

        if( exchange._id == exchangeID ){

                $scope.$applyAsync( function(){

                    $scope.exchange = exchange;                    
                });

        }
    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });

    


    // Functions for browser use -------------------------------------------------------------------------------------------


    $scope.submitFeedback = function( ){

        FeedbackService.createFeedback( $scope.feedback ).then( function( createdFeedback ){ 

            if( $scope.userIsSender ){

                $scope.exchange.feedback.sender = createdFeedback.data

            }else{

                $scope.exchange.feedback.recipient = createdFeedback.data
            }

            amendExchange()
            updateFeedbackScore()

            $scope.feedbackSubmitted = createdFeedback.data


        })

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

    var updateFeedbackScore = function( ){

        UserService.getUser( $scope.otherUser._id ).then(function( user ){

            user.feedback.count += 1
            user.feedback.total = parseFloat( $scope.feedback.rating ) + parseFloat( user.feedback.total )
            user.feedback.score = +((user.feedback.total/user.feedback.count*50).toFixed(2));

            UserService.updateUser( user ).then(function(){


            }, function(){

                alert( "User not updated" );
            })

        })

    }


}]);