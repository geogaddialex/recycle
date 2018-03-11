angular.module('myApp').controller('itemController', function( $routeParams, $location, $route, $scope, ngDialog, SocketService, ItemService, TagService, AuthService, UtilityService ){
    
    var itemId = $routeParams.id;
    var tag = $routeParams.tag;
    var query = $routeParams.query;

    $scope.UtilityService = UtilityService
    $scope.error = {}

    AuthService.getUser().then( function(user){
      $scope.user = user;
    

        if( itemId ){

          ItemService.getItem( itemId ).then( function( item ){

            $scope.item = item;
            $scope.viewingOwnItem = $scope.user._id == item.owner._id

              if( $scope.viewingOwnItem ){
                
                $scope.newTag = {
                  name: ""
                }

                TagService.getTags(  ).then( function( tags ){
                  
                    $scope.tags = tags;

                }).catch( function( err ){

                  setError("Could not retrieve tags")
                });

              }

          }).catch( function( err ){

            setError("Could not retrieve item")
          });       
            
        }

        if( $location.path() == "/items" ){

          ItemService.getItems( ).then( function( items ){

            $scope.items = items;

          }).catch( function( err ){

              setError("Could not retrieve items")
          });
        }

        if( $location.path() == "/myItems" ){

            ItemService.getItemsBelongingTo( $scope.user._id ).then( function( items ){
              
              $scope.myItems = items;

            }).catch( function( err ){

              setError("Could not retrieve items")
              
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

              setError("Could not retrieve tags")
            });

        }


        if( ($location.path().split('/').indexOf('tags') > -1) && tag){

          ItemService.getItemsWithTag( tag ).then( function( items ){
              
            $scope.items = items;

          }).catch( function( err ){

            setError("Could not retrieve items")
          });

        }

        if( ($location.path().split('/').indexOf('search') > -1) && query){

          ItemService.getItemsMatchingSearch( query ).then( function( items ){
              
            $scope.items = items;

          }).catch( function( err ){

            setError("Could not retrieve items")
          });

        }


    });



    //Socket events

    SocketService.on('item.created', function( item ){

    });
   
    $scope.$on( '$destroy', function( event ){

      SocketService.getSocket().removeAllListeners();
    });



    //Functions for browser use

    $scope.createItem = function( item ){

        clearError()


        if( !UtilityService.isValidItemName( item.name )){

            setError("Not a valid item name, names must be between 3 and 30 characters")

        }else if( !$scope.newItem.condition ){

            setError("Please select an item condition")

        }else{

            ngDialog.openConfirm({ 

                template: '/partials/dialog_create_item.html'

            }).then(function (success) {

                  ItemService.createItem( item ).then( function( ){ 

                      $location.path("/myItems");

                  }, function(){
                      setError("Item not created" );
                  })

            }, function (error) {

            });
            
        }

      
    }

    $scope.deleteItem = function( ID, event ){

      clearError()
   
      ngDialog.openConfirm({ 

          template: '/partials/dialog_delete_item.html'

      }).then(function (success) {

        ItemService.deleteItem( ID ).then( function( ){ 

            $route.reload();

         }, function(){

            setError( "Item not deleted" );
         })

      }, function (error) {

      });
        
          


    };  
    

    $scope.updateItem = function(){

      clearError()

      if( !UtilityService.isValidItemName( $scope.item.name )){

            setError("Not a valid item name, names must be between 3 and 30 characters")

      }else{

        ngDialog.openConfirm({ 

          template: '/partials/dialog_save_changes.html'
          
        }).then(function (success) {

              ItemService.updateItem( $scope.item ).then( function(){

                $location.path("/myItems");

              }, function(){

                setError( "Item could not be updated" );
              })

        }, function (error) {

        });

      }

    }

    $scope.resetItem = function(){

      clearError()

      ngDialog.openConfirm({ 

          template: '/partials/dialog_reset_changes.html'
          
        }).then(function (success) {

            ItemService.getItem( itemId ).then( function( item ){

                $scope.item = item;

            }, function(){

              setError( "Something went wrong" )

            })

        }, function (error) {


        });

    }

    $scope.addTag = function( tagToAdd ){

      clearError()
      var itemToEdit = $scope.item ? $scope.item : $scope.newItem

      if( !$scope.selectedTag ){

        setError("Please select a tag to add")

      }else if( $scope.selectedTag === "addTag" ){

          // TagService.getTag( tagToAdd ).then( function( tag ){

          //   var tagExists = tag

          // },function(){

          //   var tagExists = false

          // })


          if( !UtilityService.isValidTagName( tagToAdd )){

              setError("Not a valid tag name, tags must be between 3 and 15 characters")

          }else if( false ){



              //need to ensure tag isnt already existing (with different capitalisation etc ) before adding to DB
              //if it already exists, just push that tag rather than giving an error

          }else{

            ngDialog.openConfirm({ 

              template: '/partials/dialog_create_tag.html'
              
            }).then(function (success) {

                TagService.createTag({ name: tagToAdd }).then( function( newTag ){

                    itemToEdit.tags.push( newTag.data )
                    $scope.newTag.name = ""

                }, function(){

                  setError("Tag couldn't be added")
                })

            }, function(error){

            })
              
          }


      }else{

          var uniqueTag = itemToEdit.tags.findIndex(i => i._id === $scope.selectedTag._id) == -1

          if(uniqueTag){
          
              itemToEdit.tags.push( $scope.selectedTag )
          
          }else{

              setError( "You have already added that tag" )

          }

      }

    }

    $scope.removeTag = function( tag, event ){

      event.preventDefault()

      var itemToEdit = $scope.item ? $scope.item : $scope.newItem
      var tags = itemToEdit.tags
      var tagIndex =  tags.findIndex(i => i._id === tag._id)

      tags.splice( tagIndex, 1 )
      
    }

    $scope.selectTag = function(tag) {
      $scope.selectedTag = tag
    }


    var clearError = function(){

      $scope.error.message = undefined

    }

    var setError = function( message ){

      $scope.error.message = message

    }


});