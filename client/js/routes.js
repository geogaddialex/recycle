var myApp = angular.module("myApp", ['ngRoute']);

myApp.config( function( $routeProvider, $locationProvider ){
    $routeProvider
        .when('/', { templateUrl: 'partials/home.html', controller: 'homeController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/login', { templateUrl: 'partials/login.html', controller: 'loginController', access: { restricted: false } })
        .when('/items/add', { templateUrl: 'partials/addItem.html', controller: 'itemController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/users', { templateUrl: 'partials/users.html', controller: 'userController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/users/:username', { templateUrl: 'partials/user.html', controller: 'userController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/items', { templateUrl: 'partials/items.html', controller: 'itemController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/profile', { templateUrl: 'partials/profile.html', controller: 'profileController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/myItems', { templateUrl: 'partials/myItems.html', controller: 'itemController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/exchange', { templateUrl: 'partials/exchange.html', controller: 'exchangeController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/exchange/:username', { templateUrl: 'partials/exchange.html', controller: 'exchangeController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/exchange/:username/:item', { templateUrl: 'partials/exchange.html', controller: 'exchangeController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/items/:id', { templateUrl: 'partials/item.html', controller: 'itemController', controllerAs: 'ctrl', access: { restricted: true } })
        .otherwise({ templateUrl: 'partials/404.html', access: { restricted: true } });

    $locationProvider.html5Mode({ enabled: true, rewriteLinks: false });
});

myApp.run( function( $rootScope, $location, $route, AuthService ){

    $rootScope.$on( '$routeChangeStart', function( event, next, current ){
        AuthService.getUserStatus( ).then( function( ){

            if( next.access ){
                if( next.access.restricted && !AuthService.isLoggedIn() ){
                  $location.path( '/login' );
                  $route.reload();
                }
            }
            
        }).catch( function( err ){
            console.log( "error = " + err );
        });
    });
});




