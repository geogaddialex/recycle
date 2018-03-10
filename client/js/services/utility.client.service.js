angular.module( 'myApp' ).factory( 'UtilityService', function( ){

    return ({
      formatTimestamp: formatTimestamp,
      getUserName: getUserName,
      isValidMessage: isValidMessage,
      isValidUserName: isValidUserName,
      isValidItemName: isValidItemName,
      isValidTagName: isValidTagName,
      isValidGroupName: isValidGroupName,
      isValidPassword: isValidPassword,
      passwordsMatch: passwordsMatch
    });


    function formatTimestamp( date, format ){

        return format=="short" ? Date.parse(date).toString('dd/MM HH:mm') : Date.parse(date).toString('dd MMMM yyyy, HH:mm')
    }

    function getUserName( user ){

        return name = user.local ? user.local.name : user.google ? user.google.name : user.facebook.name
    }

    function isValidMessage( message ){

        var notBlank = /^(?!\s*$).+/

        if (!message) return false

        return ( message.length > 0 && message.match( notBlank ) ) ? true : false

    }

    function isValidUserName( name ){

      if (!name) return false

      var notBlank = /^(?!\s*$).+/

      return ( name.match( notBlank ) ) ? true : false
        
    }

    function isValidItemName( name ){

        if (!name) return false

        return ( name.length > 2 && name.length < 31 ) ? true : false
        
    }

    function isValidTagName( name ){

      if (!name) return false

      return ( name.length > 2 && name.length < 16 ) ? true : false
        
    }

    function isValidGroupName( name ){

      if (!name) return false

      return ( name.length > 3 && name.length < 41 ) ? true : false
        
    }

    function isValidPassword( password ){

      //8 chars minimum, lowercase, uppercase, number, special char

      var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

      return ( password.match( regex ) ) ? true : false
    }   

    function passwordsMatch( one, two ){

      return ( one === two ) ? true : false
    }

});