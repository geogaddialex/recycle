var myApp = angular.module("myApp", ['ngRoute']);

myApp.config( function( $routeProvider, $locationProvider ){
    $routeProvider
        .when('/', { templateUrl: 'partials/home.html', access: { restricted: true } })

        .when('/enter', { templateUrl: 'partials/enter.html', controller: 'loginController', access: { restricted: false } })
        .when('/connect/local', { templateUrl: 'partials/createLocal.html', controller: 'loginController', access: { restricted: true } })
        .when('/profile', { templateUrl: 'partials/profile.html', controller: 'profileController', access: { restricted: true } })

        .when('/users', { templateUrl: 'partials/users.html', controller: 'userController', access: { restricted: true } })
        .when('/users/:user', { templateUrl: 'partials/user.html', controller: 'userController', access: { restricted: true } })

        .when('/items', { templateUrl: 'partials/items_browse.html', controller: 'itemController', access: { restricted: true } })
        .when('/items/add', { templateUrl: 'partials/items_new.html', controller: 'itemController', access: { restricted: true } })
        .when('/items/:id', { templateUrl: 'partials/item.html', controller: 'itemController', access: { restricted: true } })
        .when('/myItems', { templateUrl: 'partials/items_my.html', controller: 'itemController', access: { restricted: true } })

        .when('/myExchanges', { templateUrl: 'partials/exchanges_my.html', controller: 'exchangeController', access: { restricted: true } })
        .when('/exchanges', { templateUrl: 'partials/exchanges.html', controller: 'exchangeController', access: { restricted: true } })
        .when('/exchange/:id', { templateUrl: 'partials/exchange.html', controller: 'exchangeController', access: { restricted: true } })
        .when('/newExchange', { templateUrl: 'partials/exchanges_new.html', controller: 'exchangeController', access: { restricted: true } })
        .when('/newExchange/:user', { templateUrl: 'partials/exchanges_new.html', controller: 'exchangeController', access: { restricted: true } })
        .when('/newExchange/:user/:item', { templateUrl: 'partials/exchanges_new.html', controller: 'exchangeController', access: { restricted: true } })

        .when('/feedback/:id', { templateUrl: 'partials/feedback.html', controller: 'feedbackController', access: { restricted: true } })
        
        .otherwise({ templateUrl: 'partials/404.html', access: { restricted: true } });

    $locationProvider.html5Mode({ enabled: true, rewriteLinks: false });
});

myApp.run( function( $rootScope, $location, $route, AuthService ){

    $rootScope.location = $location

    $rootScope.$on( '$routeChangeStart', function( event, next, current ){
        AuthService.getUserStatus( ).then( function( ){

            if( next.access ){
                if( next.access.restricted && !AuthService.isLoggedIn() ){ // next.access.adminOnly && !AuthService.getUser().isAdmin
                  $location.path( '/enter' );
                  $route.reload();
                }
            }
            
        }).catch( function( err ){
            console.log( "error = " + err );
        });
    });
});




