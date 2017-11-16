angular.module( 'myApp' ).factory( 'AuthService', [ '$q', '$timeout', '$http', function( $q, $timeout, $http ){

  var user = null;

    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      getUser: getUser,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn( ){
        if( user ){
          return true;
        } else {
          return false;
        }
    }

    function getUserStatus() {
      return $http.get( '/api/login/status' ).then(
        function successCallback( res ) {

            if( res.data.authenticated ){
              user = true;
            } else {
              user = false;
            }
        }, function errorCallback( res ){
            user = false;
        }
      );
    }

    function getUser() {
      
      var deferred = $q.defer();

      $http.get( '/api/login/user' ).then(
        function successCallback( res ) {

            if( res.data.user ){
              deferred.resolve( res.data.user );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){
          deferred.reject();
        }
      );

      return deferred.promise;
    }

    function register( username, password, email ){

        var deferred = $q.defer();

        $http.post( '/api/login/register', { username: username, password: password, email: email } ).then(
          function successCallback( res ){
            deferred.resolve();
        }, function errorCallback( res ){
            deferred.reject();
        });

        return deferred.promise;
    }

    function login( username, password ){

        var deferred = $q.defer();

        $http.post('/api/login/login', { username: username, password: password }).then( 
            function successCallback( res ){
                user = true;
                deferred.resolve();
        }, function errorCallback( res ){
                user = false;
                deferred.reject();
        });

        return deferred.promise;
    }

    function logout( ){

        var deferred = $q.defer();

        $http.get( '/api/login/logout' ).then( 
            function successCallback( res ){

            user = false;
            deferred.resolve();

        }, function errorCallback( res ){

            user = false;
            deferred.reject();
        });

        return deferred.promise;
    }

}]);