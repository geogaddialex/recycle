angular.module('myApp').controller('userController', function( $routeParams, $location, $scope, ItemService, AuthService, UserService, FeedbackService, UtilityService ){

    $scope.UtilityService = UtilityService
    $scope.error = {}

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

          }).catch( function( err ){

              setError( "Cannot get items" )

          });  

          FeedbackService.getFeedbackRegarding( user._id ).then( function( feedbacks ){

            $scope.feedbacks = feedbacks

          }, function(){

              setError( "Cannot get feedback for user" )

          })

      }).catch(function( err ){
        
          setError( "Cannot get user" )
      });
     
    }


    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }
    
});