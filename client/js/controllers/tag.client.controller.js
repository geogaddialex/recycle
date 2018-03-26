angular.module('myApp').controller('tagController', function( AuthService, ngDialog, UserService, TagService, UtilityService, SocketService, $scope, $location, $haversine ){

	$scope.UtilityService = UtilityService
    $scope.error = {}

    TagService.getTags( ).then( function( tags ){

      $scope.tags = tags

    }, function(){

    	setError( "Cannot get tags" )

    })

    AuthService.getUser().then( function(user){

      $scope.user = user;
      
    }, function(){

      setError( "Cannot get user" )
    })

    SocketService.on('tag.created', function( tag ){

          $scope.tags.push( tag )
          $scope.$apply()

    });

    $scope.filterDistance = function( item ){

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

    $scope.showInfo = function( item ){

        ngDialog.open({ 

          template: '/partials/dialog_item_details.html',
          controller: 'itemDetailsController',
          data: { item: item, user: $scope.user }
          
        })

    }

    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }
    
})