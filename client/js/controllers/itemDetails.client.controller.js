angular.module('myApp').controller('itemDetailsController', function( UtilityService, $scope, $haversine, ItemService ){

	$scope.UtilityService = UtilityService
	$scope.user = $scope.ngDialogData.user


	ItemService.getItem( $scope.ngDialogData.item._id ).then( function( item ){

		$scope.item = item

    }, function(){

        setError( "Could not get item" )
    })

})