angular.module( 'myApp' ).factory( 'GroupService', function( $q, $timeout, $http ){

    return ({
      getGroups: getGroups,
      getGroup: getGroup,
      createGroup: createGroup,
      updateGroup: updateGroup,
      getGroupsJoinedBy: getGroupsJoinedBy,
      getItemsForGroup: getItemsForGroup
    });


    function createGroup( group ){
      return $http({ method: 'POST', url: '/api/groups', data: group });
    }

    function updateGroup( group ){
      return $http({ method: 'PUT', url: '/api/groups/'+group._id, data: group });
    }


    function getGroup( id ){

      var deferred = $q.defer();

      $http.get( '/api/groups/'+id ).then(
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


    function getGroups(){
      
      var deferred = $q.defer();

      $http.get( '/api/groups' ).then(
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

    function getItemsForGroup( id ){
       
      var deferred = $q.defer();
      var url = '/api/groups/'+id+'/items'

      $http.get( url ).then(
        function successCallback( res ) {

            if( res.data.items ){
              deferred.resolve( res.data.items );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){

          console.log( "error: " + res.data );

          deferred.reject();
        }
      ).catch( function( err ){
        console.log( "caught error: " + err );
      });

      return deferred.promise;
    }



    function getGroupsJoinedBy( id ){
       
      var deferred = $q.defer();
      var url = '/api/groups/forUser/'+id

      $http.get( url ).then(
        function successCallback( res ) {

            if( res.data.groups ){
              deferred.resolve( res.data.groups );
            } else {
              deferred.reject();
            }

        }, function errorCallback( res ){

          console.log( "error: " + res.data );

          deferred.reject();
        }
      ).catch( function( err ){
        console.log( "caught error: " + err );
      });

      return deferred.promise;
    }
    


});