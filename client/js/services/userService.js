angular.module( 'myApp' ).factory( 'UserService', [ '$q', '$timeout', '$http', function( $q, $timeout, $http ){

  return ({
    getUsers: getUsers,
    getUser: getUser,
    createUser: createUser,
    getUserByName: getUserByName
  });


  function createUser( user ){
    return $http({ method: 'POST', url: '/api/users', data: user }); //check API link (all in service)
  }

  function getUser( id ){

    var deferred = $q.defer();

    $http.get( '/api/users/'+id ).then(
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

  function getUserByName( username ){

    var deferred = $q.defer();

      $http.get( '/api/users/byUsername/'+username ).then(
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


  function getUsers(){
    
    var deferred = $q.defer();

    $http.get( '/api/users' ).then(
      function successCallback( res ) {

          if( res.data.users ){
            deferred.resolve( res.data.users );
          } else {
            deferred.reject();
          }

      }, function errorCallback( res ){

        deferred.reject();
      }
    );

    return deferred.promise;
  }


}]);