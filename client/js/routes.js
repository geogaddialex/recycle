angular.module("myApp").config( function( $routeProvider, $locationProvider ){
    $routeProvider
        .when('/', { templateUrl: 'partials/home.html', restricted: true })

        .when('/enter', { templateUrl: 'partials/enter.html', controller: 'loginController' })
        .when('/connect/local', { templateUrl: 'partials/createLocal.html', controller: 'loginController', restricted: true })
        .when('/profile', { templateUrl: 'partials/profile.html', controller: 'profileController', restricted: true })

        .when('/users', { templateUrl: 'partials/users.html', controller: 'userController', restricted: true })
        .when('/users/:user', { templateUrl: 'partials/user.html', controller: 'userController', restricted: true })
        .when('/users/:user/feedback', { templateUrl: 'partials/feedback.html', controller: 'userController', restricted: true })

        .when('/items', { templateUrl: 'partials/items_browse.html', controller: 'itemController', restricted: true })
        .when('/items/add', { templateUrl: 'partials/items_new.html', controller: 'itemController', restricted: true })
        .when('/items/:id', { templateUrl: 'partials/item.html', controller: 'itemController', restricted: true })
        .when('/myItems', { templateUrl: 'partials/items_my.html', controller: 'itemController', restricted: true })

        .when('/tags/:tag', { templateUrl: 'partials/tag.html', controller: 'itemController', restricted: true })
        .when('/tags', { templateUrl: 'partials/tags.html', controller: 'tagController', restricted: true })

        .when('/myExchanges', { templateUrl: 'partials/exchanges_my.html', controller: 'exchangeController', restricted: true })
        .when('/exchanges', { templateUrl: 'partials/exchanges.html', controller: 'exchangeController', restricted: true })

        .when('/exchange/:id', { templateUrl: 'partials/exchange.html', controller: 'exchangeController', restricted: true })

        .when('/newExchange', { templateUrl: 'partials/exchanges_new.html', controller: 'exchangeController', restricted: true })
        .when('/newExchange/:user', { templateUrl: 'partials/exchanges_new.html', controller: 'exchangeController', restricted: true })
        .when('/newExchange/:user/:item', { templateUrl: 'partials/exchanges_new.html', controller: 'exchangeController', restricted: true })

        .when('/myGroups', { templateUrl: 'partials/groups_my.html', controller: 'groupController', restricted: true })
        .when('/groups', { templateUrl: 'partials/groups_browse.html', controller: 'groupController', restricted: true })
        .when('/newGroup', { templateUrl: 'partials/groups_new.html', controller: 'groupController', restricted: true })
        .when('/groups/:id', { templateUrl: 'partials/group.html', controller: 'groupController', restricted: true })

        .when('/notifications', { templateUrl: 'partials/notifications.html', controller: 'notificationController', restricted: true })
        .when('/search/:query', { templateUrl: 'partials/search.html', controller: 'itemController', restricted: true })
        
        .when('/help', { templateUrl: 'partials/help.html' })
        
        .otherwise({ templateUrl: 'partials/404.html', restricted: true });

    $locationProvider.html5Mode({ enabled: true, rewriteLinks: false });
});

angular.module("myApp").run( function( $rootScope, $location, $route, AuthService ){

    $rootScope.location = $location

    $rootScope.$on( '$routeChangeStart', function( event, next, current ){
        AuthService.getUserStatus( ).then( function( ){

            var loggedIn = AuthService.isLoggedIn( )

            if( loggedIn ){

                AuthService.getUser().then(function( user ){

                    if( !user.location ){

                        $location.path( '/profile' );

                    }

                }, function(){

                })

            }else if( next.restricted && !loggedIn ){

                  $location.path( '/enter' );
            }

            // else if( next.adminOnly && !user.isAdmin ){

            //     $location.path( '/accessDenied' );

            // }
            
        }).catch( function( err ){
            console.log( "error = " + err );
        });
    });
});




