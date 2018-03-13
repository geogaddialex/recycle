angular.module('myApp').controller('itemDetailsController', function( UtilityService, $scope, $haversine ){

	$scope.UtilityService = UtilityService

  	$scope.item = $scope.ngDialogData.item
  	$scope.user = $scope.ngDialogData.user

})