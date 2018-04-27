angular.module( 'myApp' ).factory( 'MessageService', function( $http ){

    return ({
      createMessage: createMessage
    });

    function createMessage( message ){
      return $http({ method: 'POST', url: '/api/messages', data: message });
    }

});