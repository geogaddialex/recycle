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

              if($scope.viewingOwnItem){
                
                $scope.newTag = {
                  name: ""
                }

                TagService.getTags(  ).then( function( tags ){
                  
                    $scope.tags = tags;

                }).catch( function( err ){

                  console.log( "error getting tags = " + err );
                });

              }

          }).catch( function( err ){
            console.log( "error getting item = " + err );
          });       
            
        }

        if( $location.path() == "/items" ){

          ItemService.getItems( ).then( function( items ){

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

    $scope.resetItem = function(){

      ItemService.getItem( itemId ).then( function( item ){

          $scope.item = item;

      }, function(){

      })

    }

    $scope.addTag = function( tagToAdd ){

      var itemToEdit = $scope.item ? $scope.item : $scope.newItem

      if( $scope.selectedTag === "addTag" ){

        //need to ensure tag isnt already existing (with different capitalisation etc ) before adding to DB

          TagService.createTag({ name: tagToAdd }).then( function( newTag ){

            itemToEdit.tags.push( newTag.data )
            $scope.newTag.name = ""

          }, function(){

            alert( "Tag not added" );
          })

      }else{

        itemToEdit.tags.push( $scope.selectedTag )

      }

    }

    $scope.selectTag = function(tag) {
      $scope.selectedTag = tag
    }

    $scope.removeTag = function( tag, event ){

      event.preventDefault()

      var itemToEdit = $scope.item ? $scope.item : $scope.newItem
      var tags = itemToEdit.tags
      var tagIndex =  tags.findIndex(i => i._id === tag._id)

      tags.splice( tagIndex, 1 )
      
    }


}]);