angular.module('myApp').controller('userController', function( $routeParams, $location, $scope, ngDialog, ItemService, AuthService, UserService, FeedbackService, UtilityService, ExchangeService ){

    $scope.UtilityService = UtilityService
    $scope.error = {}

    AuthService.getUser().then( function( user ){

      $scope.userThatsViewing = user
    }, function(){

      setError("Cannot get user")
    })

    if( $location.path() == "/users" ){

      UserService.getUsers( ).then( function( users ){

        $scope.users = users;

      }, function(){

          setError( "Cannot get users" )

      });
    }

    if( $location.path().indexOf( "/users/" ) > -1 ){

      var userID = $routeParams.user;

      UserService.getUser( userID ).then( function( user ){

          $scope.user = user;

          ItemService.getItemsBelongingTo( $scope.user._id ).then( function( items ){
            
            $scope.user.items = items;

          }, function( err ){

              setError( "Cannot get items" )

          });  

          FeedbackService.getFeedbackRegarding( user._id ).then( function( feedbacks ){

            $scope.feedbacks = feedbacks

          }, function(){

              setError( "Cannot get feedback for user" )

          })

          ExchangeService.getExchangesInvolving( user._id ).then( function( exchanges ){

            $scope.exchanges = exchanges

          }, function(){

              setError( "Cannot get feedback for user" )

          })

      }, function( err ){
        
          setError( "Cannot get user" )
      });
     
    }

    $scope.showInfo = function( item ){

        ngDialog.open({ 

          template: '/partials/dialog_item_details.html',
          controller: 'itemDetailsController',
          data: { item: item, user: $scope.userThatsViewing }
          
        })

    }


    $scope.showAllFeedback = function( user ){

        $location.path( '/users/'+user._id+'/feedback' )
    }


    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }
    
});