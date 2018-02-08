angular.module( 'myApp' ).factory( 'UtilityService', [ function( ){

    return ({
      formatTimestamp: formatTimestamp,
      getUserName: getUserName
    });


    function formatTimestamp( date, format ){

        return format=="short" ? Date.parse(date).toString('dd/MM HH:mm') : Date.parse(date).toString('dd MMMM yyyy, HH:mm')
    }

    function getUserName( user ){

        return name = user.local ? user.local.name : user.google ? user.google.name : user.facebook.name
    }

}]);