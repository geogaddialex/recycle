angular.module( 'myApp' ).factory( 'UtilityService', function( $q, $http, $haversine ){

    return ({
      formatTimestamp: formatTimestamp,
      getUserName: getUserName,
      isValidMessage: isValidMessage,
      isValidUserName: isValidUserName,
      isValidItemName: isValidItemName,
      isValidItemDescription: isValidItemDescription,
      isValidTagName: isValidTagName,
      isValidGroupName: isValidGroupName,
      isValidPassword: isValidPassword,
      isValidEmail: isValidEmail,
      passwordsMatch: passwordsMatch,
      isEmailTaken: isEmailTaken,
      metresToMiles: metresToMiles,
      calculateDistance: calculateDistance
    });

    function metresToMiles( metres ){
      return (metres*0.000621371).toFixed(0)
    }


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

    function isValidItemDescription( desc ){

        return ( !desc || desc.length < 500  ) ? true : false
        
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

    function isValidEmail( email ){

      var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return ( regex.test( email ) ) ? true : false
    }   

    function passwordsMatch( one, two ){

      return ( one === two ) ? true : false
    }


    function isEmailTaken( email ){

      var deferred = $q.defer();

      $http({

          url: "/api/users/byEmail/"+email, 
          method: "GET"

       }).then(

        function successCallback( res ) {

            if( res.data ){

              deferred.resolve( true );

            } else {

              deferred.resolve( false );

            }

        }, function errorCallback( res ){

          deferred.resolve( false );
        }
      );

      return deferred.promise;
    }


    function isValidLocation( location ){

      var deferred = $q.defer();

      $http({

          url: "/api/users/byEmail/"+email, 
          method: "GET"

       }).then(

        function successCallback( res ) {

            if( res.data ){

              deferred.resolve( true );

            } else {

              deferred.resolve( false );

            }

        }, function errorCallback( res ){

          deferred.resolve( false );
        }
      );

      return deferred.promise;
    }

    function calculateDistance( user1, user2 ){

        var user1Location = {
          "latitude": user1.location.lat,
          "longitude": user1.location.lng
        };
        var user2Location = {
          "latitude": user2.location.lat,
          "longitude": user2.location.lng
        };

        return metresToMiles( $haversine.distance(user1Location, user2Location) )

    }

});