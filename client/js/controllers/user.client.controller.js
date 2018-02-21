angular.module('myApp').controller('userController', [ '$routeParams', '$location', '$scope', 'ItemService', 'AuthService', 'UserService', 'FeedbackService', 'UtilityService', function( $routeParams, $location, $scope, ItemService, AuthService, UserService, FeedbackService, UtilityService ){


    $scope.UtilityService = UtilityService

    if( $location.path() == "/users" ){
      UserService.getUsers( ).then( function( users ){
        $scope.users = users;
      });
    }

    if( $location.path().indexOf( "/users/" ) > -1 ){ //better way to see if there are items after the slash?

      var userID = $routeParams.user;

      UserService.getUser( userID ).then( function( user ){

          //this could be bad, might replace authorised user with user being viewed
          $scope.user = user;

          ItemService.getItemsBelongingTo( $scope.user._id ).then( function( items ){
            $scope.user.items = items;

          }).catch( function( err ){

            console.log( "error = " + err );
            $scope.user.items = {};

          });  

          FeedbackService.getFeedbackRegarding( user._id ).then( function( feedbacks ){

            $scope.feedbacks = feedbacks

          })

      }).catch(function( err ){
        
          console.log("err: " + err)
      });
     
    }
    

}]);