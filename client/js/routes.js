var myApp = angular.module("myApp", ['ngRoute']);

myApp.config( function( $routeProvider ){
    $routeProvider
        .when('/', { templateUrl: 'partials/home.html', controller: 'homeController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/login', { templateUrl: 'partials/login.html', controller: 'loginController', access: { restricted: false } })
        .when('/items/add', { templateUrl: 'partials/addItem.html', controller: 'itemController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/users', { templateUrl: 'partials/users.html', controller: 'usersController', controllerAs: 'ctrl', access: { restricted: true } })
        .when('/items', { templateUrl: 'partials/items.html', controller: 'itemController', controllerAs: 'ctrl', access: { restricted: true } })
        .otherwise({ templateUrl: 'partials/404.html', controller: 'errorController', controllerAs: 'ctrl', access: { restricted: true } });
});

myApp.run( function( $rootScope, $location, $route, AuthService ){

    $rootScope.$on( '$routeChangeStart', function( event, next, current ){
        AuthService.getUserStatus().then( function( ){

            if( next.access ){
                if( next.access.restricted && !AuthService.isLoggedIn() ){
                  $location.path('/login');
                  $route.reload();
                }
            }
            
        });
    });
});




