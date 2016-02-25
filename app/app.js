
var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar']);

app.config(function ($routeProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "app/views/login.html"
    });

    $routeProvider.when("/mainmenu", {
        controller: "mainmenuController",
        templateUrl: "app/views/mainmenu.html"
    });

    $routeProvider.when("/signup", {
        controller: "mainmenuController",
        templateUrl: "app/views/signup.html"
    });


    $routeProvider.when("/inventory", {
        controller: "inventoryController",
        templateUrl: "app/views/inventory.html"
    });

    $routeProvider.when("/FindItems", {
        controller: "FindItemsController",
        templateUrl: "app/views/FindItems.html"
    });
    $routeProvider.when("/item", {
        controller: "itemController",
        templateUrl: "app/views/item.html"
    });


    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "app/views/orders.html"
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "app/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "app/views/tokens.html"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "app/views/associate.html"
    });

    $routeProvider.otherwise({ redirectTo: "/login" });

});

//var serviceBase = 'http://localhost:26264/';
var serviceBase = 'http://dev.style.u8i9.com/API/ClearlyInventoryAPI.svc/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

// factory for all messages 
app.factory('log', function () {
    toastr.options = {
        closeButton: true,
        positionClass: 'toast-top-right',
    };
    return {
        success: function (text) {
            toastr.success(text, "Success");
        },
        error: function (text) {
            toastr.error(text, "Error");
        },
        info: function (text) {
            toastr.info(text, "Info");
        },
        warning: function (text) {
            toastr.warning(text, "Warning");
        },
    };
});


