angular.module('myApp').controller('groupController', [ '$routeParams', '$location', '$route', '$scope', 'SocketService', 'ItemService', 'GroupService', 'ConversationService', 'MessageService', 'AuthService', 'UtilityService', function( $routeParams, $location, $route, $scope, SocketService, ItemService, GroupService, ConversationService, MessageService, AuthService, UtilityService ){
    
    var groupId = $routeParams.id;
    $scope.UtilityService = UtilityService

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

                }).catch( function( err ){
                  console.log( "error = " + err );
                });

            }).catch( function( err ){
              console.log( "error = " + err );
            });


            

        }

        if( $location.path() == "/groups" ){

          GroupService.getGroups( ).then( function( groups ){

            $scope.groups = groups;

          }).catch( function( err ){
              console.log( "error = " + err );
          });
        }

        if( $location.path() == "/myGroups" ){

            GroupService.getGroupsJoinedBy( $scope.user._id ).then( function( groups ){
              
              $scope.myGroups = groups;

            }).catch( function( err ){
              console.log( "error = " + err );
              $scope.myGroups = {};
            });
        }

        if( $location.path() == "/newGroup" ){

            $scope.group = {

              name: "",
              members: [ ]

            }

            $scope.group.members.push( $scope.user )
        }


    });



    //Socket events

    SocketService.on('group.created', function( group ){
        // alert( "New group added: " + group.name );
    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });



    //Functions for browser use

    $scope.createGroup = function( group ){

        var conversationToCreate = {

            users: group.members
        }


        ConversationService.createConversation( conversationToCreate ).then(function( createdConversation ){

            group.conversation = createdConversation.data;

            GroupService.createGroup( group ).then( function( ){ 

              $location.path("/myGroups");

            }, function(){
              alert( "Group not created" );
            })

        })

      
    }

    $scope.deleteGroup = function( ID ){

      GroupService.deleteGroup( ID ).then( function( ){ 

          $route.reload();

       }, function(){
          alert( "Group not deleted" );
       })
    }

    $scope.updateGroup = function(){

      GroupService.updateGroup( $scope.group ).then( function(){

        if( groupId ){

          $scope.userInGroup = $scope.group.members.findIndex(i => i._id === $scope.user._id) != -1

        } else if( $location.path() == "/groups" ){

          var groupToUpdate = $scope.groups.findIndex(i => i._id === $scope.group._id)
          $scope.groups[groupToUpdate] = $scope.group

        }

      }, function(){

        alert( "Group not updated" );
      })

    }

    $scope.joinGroup = function( ID ){

      GroupService.getGroup( ID ).then( function( group ){

        $scope.group = group
        $scope.group.members.push( $scope.user )

        $scope.updateGroup()

      })

    }

    $scope.leaveGroup = function( ID ){

      GroupService.getGroup( ID ).then( function( group ){

        if( $scope.myGroups ){

          var array = $scope.myGroups
          array.splice( array.indexOf( group ), 1 ) 

        }

        $scope.group = group

        var array = $scope.group.members
        var userIndex =  array.findIndex(i => i._id === $scope.user._id)

        array.splice( userIndex, 1 )

        $scope.updateGroup()

      })

    }

    $scope.sendMessage = function( ){

        var messageToCreate = {

            sender: $scope.user,
            content: $scope.message.text
        }

        MessageService.createMessage( messageToCreate ).then( function( createdMessage ){ 

            $scope.group.conversation.messages.push( createdMessage.data )

            $scope.message = ""
            amendConversation()

        })

    }

    $scope.userInGroup = function( group ){

      return group.members.findIndex(i => i._id === $scope.user._id) != -1

    }

    var amendConversation = function( ){

        ConversationService.updateConversation( $scope.group.conversation ).then( function( ){


        }, function(){
            alert( "Exchange not amended" );
        })

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

}]);