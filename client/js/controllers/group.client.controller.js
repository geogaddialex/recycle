angular.module('myApp').controller('groupController', function( $routeParams, $location, $route, $scope, $haversine, ngDialog, SocketService, ItemService, GroupService, ConversationService, MessageService, AuthService, UtilityService ){
    
    var groupId = $routeParams.id;
    $scope.UtilityService = UtilityService
    $scope.error = {}

    AuthService.getUser().then( function(user){
      $scope.user = user;
    

        //initialising different group pages

        if( groupId ){

            GroupService.getGroup( groupId ).then( function( group ){

                $scope.group = group;
                $scope.message = { text: "" }
                $scope.userInGroup = group.members.findIndex(i => i._id === user._id) != -1

                GroupService.getItemsForGroup( group._id ).then( function( items ){

                    $scope.items = items

                }, function( err ){

                    setError( "Cannot retrieve items" )

                });

            }).catch( function( err ){
              
              setError( "Cannot retrieve group" )
            })
            
        }

        if( $location.path() == "/groups" ){

          GroupService.getGroups( ).then( function( groups ){

            $scope.groups = groups;

          }, function( err ){
                            
              setError( "Cannot retrieve groups" )

          });
        }

        if( $location.path() == "/myGroups" ){

            GroupService.getGroupsJoinedBy( $scope.user._id ).then( function( groups ){
              
              $scope.myGroups = groups;

            }, function( err ){
                            
                setError( "Cannot retrieve groups" )

            });
        }

        if( $location.path() == "/newGroup" ){

            $scope.group = {

              name: "",
              members: [ ]

            }

            $scope.group.members.push( $scope.user )
        }


    }, function(){

        setError( "Could not get logged in user" )

    });



    //Socket events

    SocketService.on('group.created', function( group ){
        

    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });



    //Functions for browser use

    $scope.createGroup = function( group ){

        clearError( )

        if( !UtilityService.isValidGroupName( group.name ) ){

          setError( "Not a valid group name, names must be between 4 and 40 characters" )

        }else if( !UtilityService.isSanitary( group.name ) ){

          setError( "The group name can only contain letters, numbers, spaces and - / _ £ ? : . ," )

        }else{

          ngDialog.openConfirm({ 

            template: '/partials/dialog_create_group.html'

          }).then(function (success) {

              ConversationService.createConversation( ).then(function( createdConversation ){

                  group.conversation = createdConversation.data.conversation;

                  GroupService.createGroup( group ).then( function( ){ 

                    $location.path("/myGroups");

                  }, function( ){

                      setError( "Cannot create group" )

                  })

              }, function( ){

                setError( "Cannot create group" )
              })

          }, function(error){


          })

        }

    }


    $scope.updateGroup = function(){

      clearError( )

      GroupService.updateGroup( $scope.group ).then( function(){

        if( groupId ){

          $scope.userInGroup = $scope.group.members.findIndex(i => i._id === $scope.user._id) != -1

        } else if( $location.path() == "/groups" ){

          var groupToUpdate = $scope.groups.findIndex(i => i._id === $scope.group._id)
          $scope.groups[groupToUpdate] = $scope.group

        }

      }, function(){

          setError( "Cannot update group" )

      })

    }

    $scope.joinGroup = function( ID ){

      clearError( )


      GroupService.getGroup( ID ).then( function( group ){

        $scope.group = group
        $scope.group.members.push( $scope.user )

        $scope.updateGroup()

      }, function(){

          setError( "Cannot get group" )

      })

    }

    $scope.leaveGroup = function( ID ){

      clearError( )

      ngDialog.openConfirm({ 

          template: '/partials/dialog_leave_group.html'

      }).then(function (success) {

          GroupService.getGroup( ID ).then( function( group ){

            if( $scope.myGroups ){

              var array = $scope.myGroups
              var groupIndex =  array.findIndex(i => i._id === group._id)

              array.splice( groupIndex, 1 ) 

            }

            $scope.group = group

            var array = $scope.group.members
            var userIndex =  array.findIndex(i => i._id === $scope.user._id)

            array.splice( userIndex, 1 )

            $scope.updateGroup()

          }, function(){

            setError( "Could not leave group" )

          })
      }, function(error){

      })

    }

    $scope.sendMessage = function( ){

      clearError()

      if( !UtilityService.isValidMessage( $scope.message.text ) ){

          setError("Please enter a message between 1 and 500 characters long")

      }else if( !UtilityService.isSanitary( $scope.message.text ) ){

          setError( "The message can only contain letters, numbers, spaces and - / _ £ ? : . ," )

      }else{

          var messageToCreate = {

              sender: $scope.user,
              content: $scope.message.text
          }

          MessageService.createMessage( messageToCreate ).then( function( createdMessage ){ 

              $scope.group.conversation.messages.push( createdMessage.data.message )

              $scope.message.text = ""
              amendConversation()

          }, function(){

              setError( "Cannot create message" )

          })
      }

        

    }

    $scope.userInGroup = function( group ){

      return group.members.findIndex(i => i._id === $scope.user._id) != -1

    }

    $scope.filterDistance = function( item ){

        var userLocation = {
          "latitude": $scope.user.location.lat,
          "longitude": $scope.user.location.lng
        };
        var itemLocation = {
          "latitude": item.owner.location.lat,
          "longitude": item.owner.location.lng
        };

        var distance = UtilityService.metresToMiles( $haversine.distance(userLocation, itemLocation) )
        var maxDistance = $scope.user.maxDistance

        return ( distance <= maxDistance )
    };

    $scope.showInfo = function( item ){

        ngDialog.open({ 

          template: '/partials/dialog_item_details.html',
          controller: 'itemDetailsController',
          data: { item: item, user: $scope.user }
          
        })

    }

    var amendConversation = function( ){

        clearError()

        ConversationService.updateConversation( $scope.group.conversation ).then( function( ){


        }, function(){
            
            setError( "Cannot update conversation" )

        })

    }

    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }

    SocketService.on('conversation.updated', function( conversation ){

        if( conversation._id == $scope.group.conversation._id ){

            $scope.$applyAsync( function(){

                $scope.group.conversation = conversation;
              
            });
                
        }
    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });

});