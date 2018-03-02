angular.module('myApp').controller('tagController', [ 'AuthService', 'UserService', 'TagService', 'UtilityService', 'SocketService', '$scope', '$location', function( AuthService, UserService, TagService, UtilityService, SocketService, $scope, $location ){


    TagService.getTags( ).then( function( tags ){

      $scope.tags = tags

    })


    SocketService.on('tag.created', function( tag ){


          $scope.tags.push( tag )
          $scope.$apply()

    });


    
}])