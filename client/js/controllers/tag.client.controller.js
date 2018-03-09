angular.module('myApp').controller('tagController', function( AuthService, UserService, TagService, UtilityService, SocketService, $scope, $location ){

	$scope.UtilityService = UtilityService
    $scope.error = {}

    TagService.getTags( ).then( function( tags ){

      $scope.tags = tags

    }, function(){

    	setError( "Cannot get tags" )

    })

    SocketService.on('tag.created', function( tag ){

          $scope.tags.push( tag )
          $scope.$apply()

    });

    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }
    
})