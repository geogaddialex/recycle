angular.module('myApp').controller('feedbackController', [ '$routeParams', '$location', '$scope', 'ItemService', 'AuthService', 'UserService', 'ExchangeService', 'MessageService', 'FeedbackService', 'SocketService', function( $routeParams, $location, $scope, ItemService, AuthService, UserService, ExchangeService, MessageService, FeedbackService, SocketService ){
    var vm = this;

    var exchangeID = $routeParams.id;
    var path = $location.path();

    //initialise user
    AuthService.getUser().then( function( user ){
      vm.user = user;


        // viewing one existing exchange --------------------------------------- 
        if (path.split('/').indexOf('feedback') > -1){

            if( exchangeID ){

                ExchangeService.getExchange( exchangeID ).then( function( exchange ){


                    $scope.exchange = exchange;

                    $scope.feedback = {

                        rating: null,
                        comment: null,
                        author: vm.user
                    }

                    vm.userIsSender = vm.user._id == exchange.sender._id
                    vm.otherUser = vm.userIsSender ? exchange.recipient : exchange.sender

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


    vm.submitFeedback = function( ){

        console.log("feedback is: \n" + JSON.stringify($scope.feedback) )

        FeedbackService.createFeedback( $scope.feedback ).then( function( createdFeedback ){ 

            console.log("created feedback is: \n" + JSON.stringify(createdFeedback.data) )

            if( vm.userIsSender ){

                $scope.exchange.feedback.sender = createdFeedback.data

            }else{

                $scope.exchange.feedback.recipient = createdFeedback.data
            }

            amendExchange()

        })

    }


    vm.formatTimestamp = function( date, format ){

        var formattedTimestamp

        if(format == "short"){

            formattedTimestamp = Date.parse(date).toString('dd/MM HH:mm')
        
        }else if(format == "long"){

            formattedTimestamp = Date.parse(date).toString('dd MMMM yyyy, HH:mm')
        }


        return formattedTimestamp
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


}]);