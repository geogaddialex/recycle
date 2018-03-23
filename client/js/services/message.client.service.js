angular.module( 'myApp' ).factory( 'MessageService', function( $q, $timeout, $http ){

    return ({
      createMessage: createMessage
    });

    function createMessage( message ){
      return $http({ method: 'POST', url: '/api/messages', data: message });
    }

});