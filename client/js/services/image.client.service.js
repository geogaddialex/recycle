angular.module( 'myApp' ).factory( 'ImageService', function( $q, $timeout, $http ){

    return ({

      uploadImage: uploadImage
    });


    function uploadImage( image ){

      var deferred = $q.defer();

      var formData = new FormData();
      formData.append('image', image );

      $http.post( '/api/images/', formData, {

        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }

      }).then(
        
        function successCallback( res ) {

            if( res.data ){
              deferred.resolve( res.data );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){

          deferred.reject();
        }

      );

      return deferred.promise;

    }





});