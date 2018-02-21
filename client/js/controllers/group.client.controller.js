angular.module('myApp').controller('groupController', [ '$routeParams', '$location', '$route', '$scope', 'SocketService', 'ItemService', 'GroupService', 'ConversationService', 'AuthService', 'UtilityService', function( $routeParams, $location, $route, $scope, SocketService, ItemService, GroupService, ConversationService, AuthService, UtilityService ){
    
    var groupId = $routeParams.id;
    $scope.UtilityService = UtilityService

    AuthService.getUser().then( function(user){
      $scope.user = user;
    

        //initialising different group pages

        if( groupId ){

            GroupService.getGroup( groupId ).then( function( group ){

                $scope.group = group;

                $scope.userInGroup = group.members.findIndex(i => i._id === user._id) != -1

            }).catch( function( err ){
              console.log( "error = " + err );
            });


            GroupService.getItemsForGroup( groupId ).then( function( items ){

                console.log( JSON.stringify( items ))

                $scope.items = items

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

        $location.path("/groups/"+$scope.group._id);

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

        $scope.group = group

        var array = $scope.group.members
        array.splice( array.indexOf( $scope.user._id ), 1 ) 

        $scope.updateGroup()

      })

    }

}]);