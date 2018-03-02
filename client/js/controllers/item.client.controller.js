angular.module('myApp').controller('itemController', [ '$routeParams', '$location', '$route', '$scope', 'SocketService', 'ItemService', 'TagService', 'AuthService', 'UtilityService', function( $routeParams, $location, $route, $scope, SocketService, ItemService, TagService, AuthService, UtilityService ){
    
    var itemId = $routeParams.id;
    $scope.UtilityService = UtilityService


    AuthService.getUser().then( function(user){
      $scope.user = user;
    

        //initialising different item pages

        if( itemId ){

          ItemService.getItem( itemId ).then( function( item ){

            $scope.item = item;
            $scope.viewingOwnItem = $scope.user._id == item.owner._id

          }).catch( function( err ){
            console.log( "error = " + err );
          });
        }

        if( $location.path() == "/items" ){

          ItemService.getItems( ).then( function( items ){

            console.log( JSON.stringify( items, null, 2))

            $scope.items = items;

          }).catch( function( err ){
              console.log( "error = " + err );
          });
        }

        if( $location.path() == "/myItems" ){

            ItemService.getItemsBelongingTo( $scope.user._id ).then( function( items ){
              
              $scope.myItems = items;

            }).catch( function( err ){
              console.log( "error = " + err );
              $scope.myItems = {};
            });
        }

        if( $location.path() == "/items/add" ){

            $scope.newItem = {

              tags: []          
            }

            $scope.newTag = {
              name: ""
            }


            TagService.getTags(  ).then( function( tags ){
              
              $scope.tags = tags;

            }).catch( function( err ){

              console.log( "error = " + err );
            });

        }

        var tag = $routeParams.tag;

        if( ($location.path().split('/').indexOf('tags') > -1) && tag){

          ItemService.getItemsWithTag( tag ).then( function( items ){
              
            $scope.items = items;

          }).catch( function( err ){

            console.log( "error = " + err );
          });

        }


    });



    //Socket events

    SocketService.on('item.created', function( item ){
        // alert( "New item added: " + item.name );
    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });



    //Functions for browser use

    $scope.createItem = function( item ){

      ItemService.createItem( item ).then( function( ){ 
          $location.path("/myItems");
       }, function(){
          alert( "Item not created" );
       })
    }

    $scope.deleteItem = function( ID ){

      ItemService.deleteItem( ID ).then( function( ){ 
          $route.reload();
       }, function(){
          alert( "Item not deleted" );
       })
    }

    $scope.updateItem = function(){

      ItemService.updateItem( $scope.item ).then( function(){

        $location.path("/myItems");

      }, function(){
        alert( "Item not updated" );
      })

    }

    $scope.addTag = function( tagToAdd ){

      if( $scope.selectedTag === "addTag" ){

          TagService.createTag({ name: tagToAdd }).then( function( newTag ){

              $scope.newItem.tags.push( newTag.config.data )
              $scope.newTag = ""

          }, function(){

            alert( "Tag not added" );
          })

      }else{

        //don't try to add if already added
        $scope.newItem.tags.push( $scope.selectedTag )

      }


    }

    $scope.getOwnerName = function( owner ){
      return owner.local.name ? owner.local.name : owner.google.name ? owner.google.name : owner.facebook.name

    }


}]);