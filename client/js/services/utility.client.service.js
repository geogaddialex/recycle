angular.module( 'myApp' ).factory( 'UtilityService', function( ){

    return ({
      formatTimestamp: formatTimestamp,
      getUserName: getUserName,
      isValidMessage: isValidMessage,
      isValidUserName: isValidUserName,
      isValidItemName: isValidItemName,
      isValidTagName: isValidTagName,
      isValidGroupName: isValidGroupName
    });


    function formatTimestamp( date, format ){

        return format=="short" ? Date.parse(date).toString('dd/MM HH:mm') : Date.parse(date).toString('dd MMMM yyyy, HH:mm')
    }

    function getUserName( user ){

        return name = user.local ? user.local.name : user.google ? user.google.name : user.facebook.name
    }

    function isValidMessage( message ){

        var regex = /^(?!\s*$).+/

        return ( message.length > 0 && message.match( regex ) ) ? true : false

    }

    function isValidUserName( name ){
        
    }

    function isValidItemName( name ){

        return ( name.length > 2 && name.length < 31 ) ? true : false
        
    }

    function isValidTagName( name ){

       return ( name.length > 2 && name.length < 16 ) ? true : false
        
    }

    function isValidGroupName( name ){

       return ( name.length > 3 && name.length < 31 ) ? true : false
        
    }

});