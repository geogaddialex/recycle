angular.module( 'myApp' ).factory( 'AuthService', function( $q, $timeout, $http ){

  var user = null;

    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      getUser: getUser,
      login: login,
      logout: logout,
      register: register,
      createLocal: createLocal
    });


    function isLoggedIn( ){
        if( user ){
          return true;
        } else {
          return false;
        }
    }

    function getUserStatus() {
      return $http.get( '/api/auth/status' ).then(
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

      $http.get( '/api/auth/user' ).then(
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

    function register( formData ){

        var deferred = $q.defer();

        $http.post( '/api/auth/register', { 

                                            email: formData.email,
                                            password: formData.password,
                                            name: formData.name, location:
                                            formData.location

                                          })

        .then( function ( res ){
            
            deferred.resolve();

        }, function( ){

            deferred.reject();
        });

        return deferred.promise;
    }

    function createLocal( email, password, name ){

        var deferred = $q.defer();

        $http.post( '/api/auth/connect/local', { email: email, password: password, name: name } ).then(
          function successCallback( res ){
            deferred.resolve();
        }, function errorCallback( res ){
            deferred.reject();
        });

        return deferred.promise;
    }

    function login( email, password ){

        var deferred = $q.defer();

        $http.post('/api/auth/login', { email: email, password: password }).then( 
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

        $http.get( '/api/auth/logout' ).then( 
            function successCallback( res ){

            user = false;
            deferred.resolve();

        }, function errorCallback( res ){

            user = false;
            deferred.reject();
        });

        return deferred.promise;
    }

});