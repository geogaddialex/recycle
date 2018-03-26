angular.module( 'myApp' ).factory( 'UtilityService', function( $q, $http, $haversine ){

    return ({
      formatTimestamp: formatTimestamp,
      getUserName: getUserName,
      isValidMessage: isValidMessage,
      isValidFeedbackMessage: isValidFeedbackMessage,
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
      calculateDistance: calculateDistance,
      isSanitary: isSanitary,
      isNumber: isNumber
    });

    var notBlank = /^(?!\s*$).+/

    function isSanitary( input ){

      if (!input) return true

      return input.match( /^[0-9a-zA-Z\- \/_£?:.,\s]*$/ )

    }

    function isNumber( input ){

      if( !input ) return false

      return input.toString().match( /^[0-9]+$/ )
    }

    function metresToMiles( metres ){
      return (metres*0.000621371).toFixed(0)
    }


    function formatTimestamp( date, format ){

        return format=="short" ? Date.parse(date).toString('dd/MM HH:mm') : Date.parse(date).toString('dd MMMM yyyy, HH:mm')
    }

    function getUserName( user ){

        return name = user.facebook ? user.facebook.name : user.google ? user.google.name : user.local.name
    }

    function isValidMessage( message ){

        if (!message) return false

        return ( message.length > 0 && message.match( notBlank ) && message.length <=500 )

    }


    function isValidFeedbackMessage( message ){

        if (!message) return false

        return ( message.length > 0 && message.match( notBlank ) && message.length <=140 )

    }

    function isValidUserName( name ){

      if (!name) return false

      var notBlank = /^(?!\s*$).+/

      return ( name.match( notBlank ) && name.length <= 70 )
        
    }

    function isValidItemName( name ){

        if (!name) return false

        return ( name.length > 2 && name.length < 31 )
        
    }

    function isValidItemDescription( desc ){

        return ( !desc || desc.length < 500  )
        
    }

    function isValidTagName( name ){

      if (!name) return false

      return ( name.length > 2 && name.length < 16 )
        
    }

    function isValidGroupName( name ){

      if (!name) return false

      return ( name.length > 3 && name.length < 41 )
        
    }

    function isValidFeebackComment( comment ){

      if (!comment) return false

      return ( comment.length > 0 && comment.length < 141 )
    }

    function isValidPassword( password ){

      //8 chars minimum, lowercase, uppercase, number, special char

      var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

      return ( password.match( regex ) )
    }   

    function isValidEmail( email ){

      var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return ( regex.test( email ) ) ? true : false
    }   

    function passwordsMatch( one, two ){

      return ( one === two )
    }


    function isEmailTaken( email ){

      var deferred = $q.defer();

      $http({

          url: "/api/users/byEmail/"+email, 
          method: "GET"

       }).then(

        function successCallback( res ) {

            console.log( JSON.stringify( res.data,null,2 ) )

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