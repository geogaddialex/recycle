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

    $scope.filterDistance = function( item ){

        if( !item.owner.location ){
          return true
        }

        if( !$scope.user.maxDistance ){
          return true
        }

        var userLocation = {
          "latitude": $scope.user.location.lat,
          "longitude": $scope.user.location.lng
        };
        var itemLocation = {
          "latitude": item.owner.location.lat,
          "longitude": item.owner.location.lng
        };

        var distance = UtilityService.metresToMiles( $haversine.distance(userLocation, itemLocation) )
        var maxDistance = $scope.user.maxDistance

        return ( distance <= maxDistance )
    };

    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }
    
})